export interface Theme {
  name: string;
  colors: {
    bg: string;
    fg: string;
    accent: string;
    accent2: string;
    border: string;
    dimmed: string;
    character: {
      primary: string;
      secondary: string;
      highlight: string;
    };
    clone: {
      tints: string[];
    };
    particles: {
      confetti: string[];
      sparks: string[];
      sparkles: string[];
    };
    ui: {
      statusBar: string;
      activityFeed: string;
      speechBubble: string;
      controlsBar: string;
    };
  };
}
