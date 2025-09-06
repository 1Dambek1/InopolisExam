"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, Target, Trophy } from "lucide-react";

const inputFeatures = [
  { key: "PTS", label: "Points", category: "scoring" },
  { key: "REB", label: "Rebounds", category: "rebounding" },
  { key: "AST", label: "Assists", category: "playmaking" },
  { key: "STL", label: "Steals", category: "defense" },
  { key: "BLK", label: "Blocks", category: "defense" },
  { key: "TOV", label: "Turnovers", category: "efficiency" },
  { key: "FGM", label: "Field Goals Made", category: "shooting" },
  { key: "FGA", label: "Field Goals Attempted", category: "shooting" },
  { key: "FG_PCT", label: "Field Goal %", category: "shooting" },
  { key: "FG3M", label: "3-Pointers Made", category: "shooting" },
  { key: "FG3A", label: "3-Pointers Attempted", category: "shooting" },
  { key: "FG3_PCT", label: "3-Point %", category: "shooting" },
  { key: "FTM", label: "Free Throws Made", category: "shooting" },
  { key: "FTA", label: "Free Throws Attempted", category: "shooting" },
  { key: "FT_PCT", label: "Free Throw %", category: "shooting" },
  { key: "OREB", label: "Offensive Rebounds", category: "rebounding" },
  { key: "DREB", label: "Defensive Rebounds", category: "rebounding" },
  { key: "PF", label: "Personal Fouls", category: "efficiency" },
  { key: "PFD", label: "Personal Fouls Drawn", category: "efficiency" },
  { key: "PLUS_MINUS", label: "Plus/Minus", category: "impact" },
  { key: "ELO", label: "ELO Rating", category: "impact" },
  { key: "REST_DAYS", label: "Rest Days", category: "impact" },
];

const categoryColors = {
  scoring: "bg-chart-1 text-white",
  rebounding: "bg-chart-2 text-white",
  playmaking: "bg-chart-3 text-white",
  defense: "bg-chart-4 text-white",
  shooting: "bg-chart-5 text-white",
  efficiency: "bg-secondary text-secondary-foreground",
  impact: "bg-primary text-primary-foreground",
};

export default function BasketballPrediction() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [status, setStatus] = useState<boolean>(false);

  const handleInputChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
  console.log(formData);
  useEffect(() => {
const missingFields = inputFeatures
  .map((f) => f.key) // берем ключи всех фич
  .filter((key) => !formData[key] || formData[key] === ""); // фильтруем пустые или отсутствующие

if (missingFields.length === 0) {
      setStatus( true );

} else {
        setStatus(false);

}
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log(result);

      setPrediction(result);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const groupedFeatures = inputFeatures.reduce((acc, feature) => {
    if (!acc[feature.category]) acc[feature.category] = [];
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, typeof inputFeatures>);

  if (prediction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
              <h1 className="text-4xl font-bold text-balance mb-2">
                Game Prediction Results
              </h1>
              <p className="text-muted-foreground text-lg">
                AI-powered basketball analytics
              </p>
            </div>

            <Card className="mb-8">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl flex items-center justify-center gap-3">
                  <Target className="w-8 h-8 text-primary" />
                  You are win - {prediction.prediction ? "YES" : "NO"}
                </CardTitle>
                <CardDescription className="text-lg">
                  Confidence Level:{" "}
                  {prediction.prediction == 1
                    ? prediction.prob_home_win
                    : prediction.prob_home_loss}
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="text-center">
              <Button
                onClick={() => setPrediction(null)}
                variant="outline"
                size="lg"
              >
                Make Another Prediction
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BarChart3 className="w-12 h-12 text-primary" />
              <h1 className="text-5xl font-bold text-balance">
                Basketball Game Predictor
              </h1>
            </div>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Enter player statistics and team metrics to get AI-powered game
              predictions with advanced analytics
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {Object.entries(groupedFeatures).map(([category, features]) => (
              <Card key={category} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        categoryColors[category as keyof typeof categoryColors]
                      }
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Badge>
                    <CardTitle className="text-xl capitalize">
                      {category} Statistics
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature) => (
                      <div key={feature.key} className="space-y-2">
                        <Label
                          htmlFor={feature.key}
                          className="text-sm font-medium"
                        >
                          {feature.label}
                        </Label>
                        <Input
                          id={feature.key}
                          type="number"
                          step="0.01"
                          placeholder={`Enter ${feature.label.toLowerCase()}`}
                          value={formData[feature.key] || ""}
                          onChange={(e) =>
                            handleInputChange(feature.key, e.target.value)
                          }
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Submit Button */}
            {status ? (
              <div className="text-center pt-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="px-12 py-6 text-lg font-semibold"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5 mr-2" />
                      Get Prediction
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="text-center pt-6">
                <Button
                  size="lg"
                  disabled={true}
                  className="px-12 py-6 text-lg font-semibold"
                >
                  please, filled all data
                </Button>
              </div>
            )}
          </form>

          {/* Credits */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="text-center text-sm text-muted-foreground">
              <p className="mb-2">
                <strong>Basketball Game Predictor</strong> - Powered by Advanced
                AI Analytics
              </p>
              <p>
                Created with modern machine learning algorithms for accurate
                game predictions. Data-driven insights for basketball
                enthusiasts, analysts, and sports professionals.
              </p>
              <p className="mt-2 text-xs">
                © 2024 Basketball Predictor. Built with Next.js, TypeScript, and
                Tailwind CSS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
