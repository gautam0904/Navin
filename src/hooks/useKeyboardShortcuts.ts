import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in inputs/textareas
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Ctrl+1: Go to Checklist
      if (e.ctrlKey && e.key === "1") {
        e.preventDefault();
        navigate(ROUTES.CHECKLIST);
      }

      // Ctrl+2: Go to Projects
      if (e.ctrlKey && e.key === "2") {
        e.preventDefault();
        navigate(ROUTES.PROJECTS);
      }

      // Ctrl+K: Go to Settings
      if (e.ctrlKey && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        navigate(ROUTES.SETTINGS);
      }

      // Ctrl+H: Go to Home
      if (e.ctrlKey && (e.key === "h" || e.key === "H")) {
        e.preventDefault();
        navigate(ROUTES.HOME);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);
};
