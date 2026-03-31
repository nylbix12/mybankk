import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ExpenseForm from "../ExpenseForm";

describe("ExpenseForm - affichage", () => {
  it("Affiche les champs du formulaire", () => {
    render(<ExpenseForm />);
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });
});
