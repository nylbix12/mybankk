import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ExpenseList from "../ExpenseList";

describe("ExpenseList", () => {
  const mockExpenses = [
    {
      id: 1,
      label: "Loyer",
      amount: 1000,
      date: "2025-01-01",
      category: "Housing",
    },
    {
      id: 2,
      label: "Courses",
      amount: 100,
      date: "2025-01-01",
      category: "Food",
    },
  ];

  it("Affiche toutes les dépenses passées en props", () => {
    render(<ExpenseList expenses={mockExpenses} />);
    expect(screen.getByText("Loyer")).toBeInTheDocument();
    expect(screen.getByText("Courses")).toBeInTheDocument();
  });

  it("Affiche un message lorsque la liste des dépenses est vide", () => {
    render(<ExpenseList expenses={[]} />);
    expect(screen.getByText("Aucune dépense à afficher")).toBeInTheDocument();
  });
});
