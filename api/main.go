package main

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"strconv"
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
	//router.GET("/file/:index", getFileByIndex)
	router.GET("/img/:index", authMiddleware(), getFileURLByIndex)
	router.GET("/imgc", getImageCount)

	router.Static("/uploads", "./uploads")

	err := router.Run(":80")
	if err != nil {
		return
	}
}

/*
  Router Functions
*/

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

func upload(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "No files found"})
		return
	}

	files := form.File["files"]
	if len(files) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "No files found"})
		return
	}

	uploadFolder := "uploads"
	if _, err := os.Stat(uploadFolder); os.IsNotExist(err) {
		os.Mkdir(uploadFolder, os.ModePerm)
	}

	for _, file := range files {
		filePath := uploadFolder + "/" + file.Filename
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not save file"})
			return
		}
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Files uploaded successfully"})
}

func getFileByIndex(c *gin.Context) {
	index := c.Param("index")
	idx, err := strconv.Atoi(index)
	if err != nil || idx < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid index"})
		return
	}

	uploadFolder := "uploads"
	files, err := ioutil.ReadDir(uploadFolder)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not read upload folder"})
		return
	}

	if idx >= len(files) {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid index"})
		return
	}

	file := files[idx]
	filePath := uploadFolder + "/" + file.Name()

	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"message": "File not found"})
		return
	}

	c.File(filePath)
}

func getFileURLByIndex(c *gin.Context) {
	index, err := strconv.Atoi(c.Param("index"))
	if err != nil || index < 0 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid index"})
		return
	}

	uploadFolder := "uploads"
	files, err := os.ReadDir(uploadFolder)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not read upload folder"})
		return
	}

	sort.Slice(files, func(i, j int) bool {
		return files[i].Name() < files[j].Name()
	})

	if index >= len(files) {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Index out of range"})
		return
	}

	filePath := filepath.Join(uploadFolder, files[index].Name())
	fileURL := "/" + filePath

	c.JSON(http.StatusOK, gin.H{"url": fileURL})
}

func getImageCount(c *gin.Context) {
	uploadFolder := "uploads"
	files, err := os.ReadDir(uploadFolder)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Could not read upload folder"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"count": len(files)})
}

/*
  Middleware
*/

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
