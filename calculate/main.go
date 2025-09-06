package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"
	"time"

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

const OLLAMA_URL = "http://localhost:11434/api/generate"

func buildPrompt(metrics StudentMetrics) string {
	return fmt.Sprintf(
		"Given the following student metrics:\nVideosWatched: %.2f out of %.2f\nNotesCompleted: %.2f out of %.2f\nAssignmentsDone: %.2f out of %.2f\nReturn a single float score between 0 and 1, and nothing else.",
		metrics.VideosWatched, metrics.TotalVideos,
		metrics.NotesCompleted, metrics.TotalNotes,
		metrics.AssignmentsDone, metrics.TotalAssignments,
	)
}

func callOllamaLLM(metrics StudentMetrics) (float64, error) {
	payload := map[string]interface{}{
		"model":  "deepseek-r1:8b",
		"prompt": buildPrompt(metrics),
		"stream": false,
	}
	body, _ := json.Marshal(payload)

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, "POST", OLLAMA_URL, bytes.NewBuffer(body))
	if err != nil {
		return 0, err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return 0, err
	}
	defer resp.Body.Close()

	respBody, _ := io.ReadAll(resp.Body)
	var result struct {
		Response string `json:"response"`
	}
	if err := json.Unmarshal(respBody, &result); err != nil {
		return 0, err
	}

	scoreStr := strings.TrimSpace(result.Response)
	score, err := strconv.ParseFloat(scoreStr, 64)
	if err != nil {
		return 0, fmt.Errorf("could not parse float from LLM response: %s", scoreStr)
	}
	return score, nil
}

func calculateScoreHandler(c *gin.Context) {
	var metrics StudentMetrics
	if err := c.ShouldBindJSON(&metrics); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	score, err := callOllamaLLM(metrics)
	if err == nil {
		c.JSON(http.StatusOK, gin.H{"score": score, "source": "llm"})
		return
	}

	var videoScore, noteScore, assignmentScore float64
	if metrics.TotalVideos > 0 && metrics.TotalNotes > 0 && metrics.TotalAssignments > 0 {
		videoScore = (metrics.VideosWatched / metrics.TotalVideos) * 0.2
		noteScore = (metrics.NotesCompleted / metrics.TotalNotes) * 0.2
		assignmentScore = (metrics.AssignmentsDone / metrics.TotalAssignments) * 0.6
	}

	totalScore := videoScore + noteScore + assignmentScore

	// if videoScore < 0.3 || noteScore < 0.3 || assignmentScore < 0.3 {
	// 	if totalScore > 0.5 {
	// 		totalScore = 0.5
	// 	}
	// }

	c.JSON(http.StatusOK, gin.H{"score": totalScore, "source": "primitive"})
}

func main() {
	r := gin.Default()
	r.POST("/calculatescore", calculateScoreHandler)
	r.Run(":8080")
}
