package main

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"net/http"
	"os"
	"time"
)

var jwtKey = []byte("289539063892675")

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.RegisteredClaims
}

var users = map[string]string{
	"guest": "1234",
}

func main() {
	gin.SetMode(gin.ReleaseMode)

	router := gin.Default()

	router.Use(corsMiddleware())

	router.POST("/login", login)
	router.POST("/upload", authMiddleware(), upload)

	router.Run(":80")
}

func login(c *gin.Context) {
	var creds Credentials
	if err := c.BindJSON(&creds); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	expectedPassword, ok := users[creds.Username]
	if !ok || expectedPassword != creds.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid credentials"})
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Username: creds.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not create token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"access_token": tokenString})
}

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Missing authorization header"})
			c.Abort()
			return
		}

		tokenString = tokenString[len("Bearer "):]

		claims := &Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid token"})
			c.Abort()
			return
		}

		c.Set("username", claims.Username)
		c.Next()
	}
}

func upload(c *gin.Context) {
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "No file found"})
		return
	}

	uploadFolder := "uploads"
	if _, err := os.Stat(uploadFolder); os.IsNotExist(err) {
		os.Mkdir(uploadFolder, os.ModePerm)
	}

	filePath := uploadFolder + "/" + file.Filename
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not save file"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "File uploaded successfully"})
}

func corsMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Set CORS headers
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*") // You can specify a specific domain here instead of "*"
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight requests
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		// Process the request
		c.Next()
	}
}
