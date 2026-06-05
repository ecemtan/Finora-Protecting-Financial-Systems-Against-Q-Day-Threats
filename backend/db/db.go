package db

import (
	"context"
	"database/sql"
	"log"
	"time"

	"github.com/finora/mvp/backend/config"
	"github.com/go-redis/redis/v8"
	_ "github.com/lib/pq"
)

type Datastores struct {
	DB    *sql.DB
	Redis *redis.Client
}

func InitDatastores(cfg *config.Config) (*Datastores, error) {
	// 1. Initialize PostgreSQL Connection Pool
	connStr := cfg.DBConnString()
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(5 * time.Minute)

	// Verify DB Connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		db.Close()
		return nil, err
	}
	log.Println("[INFO] PostgreSQL connection pool initialized successfully.")

	// 2. Initialize Redis Client
	rdb := redis.NewClient(&redis.Options{
		Addr: cfg.RedisAddr,
	})

	// Verify Redis Connection
	if err := rdb.Ping(ctx).Err(); err != nil {
		db.Close()
		rdb.Close()
		return nil, err
	}
	log.Println("[INFO] Redis client initialized successfully.")

	return &Datastores{
		DB:    db,
		Redis: rdb,
	}, nil
}

func (ds *Datastores) Close() {
	if ds.DB != nil {
		ds.DB.Close()
	}
	if ds.Redis != nil {
		ds.Redis.Close()
	}
}
