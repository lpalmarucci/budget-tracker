import { useTransactions } from "@/features/transactions/transactions.api";
import { type DateRange } from "react-day-picker";

export const getTransactions = (date: DateRange) => useTransactions(date);
