"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface UserPreferencesProps {
  userId?: string;
  onPreferencesChange?: (preferences: any) => void;
}

export function UserPreferences({ userId, onPreferencesChange }: UserPreferencesProps) {
  const [preferences, setPreferences] = useState({
    platforms: ["netflix", "prime", "disney-plus"],
    moods: ["feel-good"],
    timeBudget: "~90",
    audience: "couple",
    type: "either"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load user preferences
  useEffect(() => {
    if (!userId || !supabase) return;
    
    const loadPreferences = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase!
          .from('user_preferences')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (data && !error) {
          setPreferences({
            platforms: data.preferred_platforms || ["netflix", "prime", "disney-plus"],
            moods: data.preferred_moods || ["feel-good"],
            timeBudget: data.preferred_time_budget || "~90",
            audience: data.preferred_audience || "couple",
            type: "either"
          });
          onPreferencesChange?.(preferences);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [userId, onPreferencesChange]);

  // Save user preferences
  const savePreferences = async (newPreferences: any) => {
    if (!userId || !supabase) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase!
        .from('user_preferences')
        .upsert({
          user_id: userId,
          preferred_platforms: newPreferences.platforms,
          preferred_moods: newPreferences.moods,
          preferred_time_budget: newPreferences.timeBudget,
          preferred_audience: newPreferences.audience,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving preferences:', error);
      } else {
        setPreferences(newPreferences);
        onPreferencesChange?.(newPreferences);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    preferences,
    savePreferences,
    isLoading,
    isSaving
  };
}

// Hook for using user preferences
export function useUserPreferences(userId?: string) {
  return UserPreferences({ userId });
}
