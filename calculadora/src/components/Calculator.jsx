import React, { useState, useEffect } from "react"; // Importando hooks necessários
import "./Calculator.css";

const Calculator = () => {
  // Estados
  const [currentValue, setCurrentValue] = useState("0"); // Armazena o valor atual digitado
  const [pendingOperation, setPendingOperation] = useState(null); // Armazena a operação selecionada
  const [pendingValue, setPendingValue] = useState(null); // Armazena o primeiro número antes do cálculo
  const [completeOperation, setCompleteOperation] = useState(""); // Representa a operação completa
  const [error, setError] = useState(false); // Armazena o estado de erro
  const [theme, setTheme] = useState("light"); // Estado para alternar tema

  const keypadNumbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const operations = ["+", "-", "*", "/"];

  // Manipulação de clique em números
  const handleClick = (val) => {
    if (error) resetCalculator(); // Reseta caso esteja em estado de erro
    setCurrentValue((prev) => (prev === "0" ? val : prev + val));
    setCompleteOperation((prev) => prev + val);
  };

  // Reseta a calculadora
  const resetCalculator = () => {
    setCurrentValue("0");
    setPendingOperation(null);
    setPendingValue(null);
    setCompleteOperation("");
    setError(false); // Redefine estado de erro
  };

  const handleClear = resetCalculator;

  // Manipulação de operações
  const handleOperation = (operation) => {
    if (error) return; // Evita novas operações em caso de erro
    if (pendingOperation) handleCalculate(); // Resolve a operação pendente antes de iniciar uma nova
    setPendingOperation(operation);
    setPendingValue(currentValue);
    setCurrentValue("0");
    setCompleteOperation((prev) => `${prev} ${operation}`);
  };

  // Realiza o cálculo
  const handleCalculate = () => {
    if (!pendingOperation || !pendingValue) return;

    const num1 = parseFloat(pendingValue);
    const num2 = parseFloat(currentValue);

    if (pendingOperation === "/" && num2 === 0) {
      setError(true);
      setCurrentValue("Error");
      setCompleteOperation("Cannot divide by zero");
      return;
    }

    // Calcula o resultado
    let result;
    switch (pendingOperation) {
      case "+":
        result = num1 + num2;
        break;
      case "-":
        result = num1 - num2;
        break;
      case "*":
        result = num1 * num2;
        break;
      case "/":
        result = num1 / num2;
        break;
      default:
        return;
    }

    setCompleteOperation(`${pendingValue} ${pendingOperation} ${currentValue} = ${result}`);
    setCurrentValue(result.toString());
    setPendingOperation(null);
    setPendingValue(null);
  };

  // Manipula entrada do teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (keypadNumbers.includes(e.key)) handleClick(e.key);
      if (operations.includes(e.key)) handleOperation(e.key);
      if (e.key === "Enter") handleCalculate();
      if (e.key === "Escape") handleClear();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [keypadNumbers, operations]);

  // Alterna tema entre claro e escuro
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Renderiza os componentes da calculadora
  return (
    <div className={`calculator ${theme}`}>
      <button onClick={toggleTheme} className="theme-toggle">
        {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
      </button>
      <div className="complete-operation">{completeOperation}</div>
      <div className="display">{currentValue}</div>
      <div className="buttons">
        <button onClick={handleClear}>AC</button>

        {keypadNumbers.map((num) => (
          <button key={num} onClick={() => handleClick(num)}>
            {num}
          </button>
        ))}
        
        {operations.map((operation) => (
          <button
            key={operation}
            onClick={() => handleOperation(operation)}
            className={operation === pendingOperation ? "active" : ""}
          >
            {operation}
          </button>
        ))}
        <button onClick={handleCalculate}>=</button>
      </div>
    </div>
  );
};

export default Calculator;
