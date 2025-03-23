import { useState } from "react";
import "./styles.css";

export default function App() {
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSpecials, setIncludeSpecials] = useState(false);
  const [clipboard, setClipboard] = useState("Copy To Clipboard");
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  console.log(passwordLength);
  async function GeneratePassword() {
    try {
      setIsLoading(true);
      setClipboard("Copy To Clipboard");
      const response = await fetch(
        `https://api.api-ninjas.com/v1/passwordgenerator?length=${passwordLength}&exclude_numbers=${includeNumbers}&exclude_special_chars=${includeSpecials}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-Api-Key": process.env.REACT_APP_API_KEY,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setIsLoading(false);
      setPassword(data.random_password);
    } catch (err) {
      alert(err);
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setClipboard("Copied!");
    } catch (err) {
      alert("Failed to copy: ", err);
    }
  };
  return (
    <div className="App">
      <div className="container">
        <h1>Password Generator</h1>

        <div className="controls-container">
          <div className="form-group">
            <label>Password Length: {passwordLength}</label>
            <input
              type="range"
              min="16"
              max="32"
              value={passwordLength}
              onChange={(e) => setPasswordLength(Number(e.target.value))}
              className="slider"
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                onChange={() => setIncludeNumbers(!includeNumbers)}
              />
              <span className="checkmark"></span>
              Exclude Numbers
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                onChange={() => setIncludeSpecials(!includeSpecials)}
              />
              <span className="checkmark"></span>
              Exclude Special Characters
            </label>
          </div>

          <button
            onClick={GeneratePassword}
            className="generate-btn"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate Password"}
          </button>
        </div>

        <div className="password-container">
          {isLoading ? (
            <div className="loading">⏳ Generating...</div>
          ) : (
            password && (
              <>
                <div className="password-display">
                  <span className="password">{password}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(password)}
                  className="copy-btn"
                >
                  {clipboard}
                </button>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
