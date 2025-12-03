package model

import (
	"time"
)

type Todos struct {
	ID          string     `gorm:"primaryKey;autoIncrement"`
	UserID      string     `gorm:"index;type:varchar(100);not null"`
	Title       string     `gorm:"type:varchar(100);not null"`
	Body        string     `gorm:"type:text"`
	DueDate     *time.Time `gorm:"type:datetime"`
	IsCompleted bool       `gorm:"type:boolean;default:false"`
	CreatedAt   time.Time  `gorm:"autoCreateTime" json:"created_at"`
	UpdatedAt   time.Time  `gorm:"autoUpdateTime" json:"updated_at"`
}
