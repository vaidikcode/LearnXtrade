package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type StudentMetrics struct {
	VideosWatched    float64 `json:"VideosWatched"`
	TotalVideos      float64 `json:"TotalVideos"`
	NotesCompleted   float64 `json:"NotesCompleted"`
	TotalNotes       float64 `json:"TotalNotes"`
	AssignmentsDone  float64 `json:"AssignmentsDone"`
	TotalAssignments float64 `json:"TotalAssignments"`
}

func calculateScoreHandler(c *gin.Context) {
	var metrics StudentMetrics
	if err := c.ShouldBindJSON(&metrics); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var videoScore, noteScore, assignmentScore float64
	if metrics.TotalVideos > 0 && metrics.TotalNotes > 0 && metrics.TotalAssignments > 0 {
		videoScore = (metrics.VideosWatched / metrics.TotalVideos) * 0.2
		noteScore = (metrics.NotesCompleted / metrics.TotalNotes) * 0.2
		assignmentScore = (metrics.AssignmentsDone / metrics.TotalAssignments) * 0.6
	}

	totalScore := videoScore + noteScore + assignmentScore

	if videoScore < 0.3 || noteScore < 0.3 || assignmentScore < 0.3 {
		if totalScore > 0.5 {
			totalScore = 0.5
		}
	}

	c.JSON(http.StatusOK, gin.H{"score": totalScore})
}

func main() {
	r := gin.Default()
	r.POST("/calculatescore", calculateScoreHandler)
	r.Run(":8080")
}
