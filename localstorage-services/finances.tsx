
import * as SecureStore from "expo-secure-store";

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const KEYS = {
  PROFILE: "finance_profile",       // net worth + currency setup
  TRANSACTIONS: "finance_txns",     // all income / expense entries
  TIMELINE: "finance_timeline",     // 5-day projected + actual daily snapshots
  CREDIT: "finance_credit",         // latest credit score record
} as const;

// ─── In-memory fallback ───────────────────────────────────────────────────────

const mem: Record<string, string> = {};

async function sGet(key: string): Promise<string | null> {
  try { return await SecureStore.getItemAsync(key); }
  catch { return mem[key] ?? null; }
}

async function sSet(key: string, val: string): Promise<void> {
  try { await SecureStore.setItemAsync(key, val); }
  catch { mem[key] = val; }
}

async function sDel(key: string): Promise<void> {
  try { await SecureStore.deleteItemAsync(key); }
  catch { delete mem[key]; }
}

// ─── Constants ────────────────────────────────────────────────────────────────

export type Currency = "USD" | "CAD" | "INR";
export type TransactionType = "income" | "expense";

export type TransactionCategory =
  | "salary"
  | "freelance"
  | "investment"
  | "gift"
  | "food"
  | "transport"
  | "shopping"
  | "bills"
  | "healthcare"
  | "entertainment"
  | "other";

/** Approximate exchange rates to USD (update as needed) */
const TO_USD: Record<Currency, number> = {
  USD: 1,
  CAD: 0.74,
  INR: 0.012,
};

export function toUSD(amount: number, currency: Currency): number {
  return amount * TO_USD[currency];
}

export function fromUSD(amountUSD: number, currency: Currency): number {
  return amountUSD / TO_USD[currency];
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FinanceProfile {
  netWorth: number;           // stored in the user's chosen currency
  currency: Currency;
  netWorthUSD: number;        // normalised for scoring
  monthlyIncome: number;      // estimated monthly income (user's currency)
  monthlyExpenses: number;    // estimated monthly expenses (user's currency)
  bankName: string;
  bankCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  amountUSD: number;          // normalised
  category: TransactionCategory;
  note: string;
  date: string;               // ISO string
}

/** A single day's financial snapshot */
export interface DaySnapshot {
  date: string;               // "YYYY-MM-DD"
  label: string;              // "Day 1", "Day 2" …
  netWorthUSD: number;        // projected or actual
  incomeUSD: number;
  expenseUSD: number;
  creditScore: number;
  isProjected: boolean;       // true = generated, false = from real transactions
}

export interface CreditRecord {
  score: number;              // 300–850
  grade: "Poor" | "Fair" | "Good" | "Very Good" | "Exceptional";
  breakdown: {
    netWorthScore: number;    // 0–200
    incomeRatioScore: number; // 0–200   (income vs expenses)
    activityScore: number;    // 0–150   (transaction frequency)
    consistencyScore: number; // 0–150   (positive balance days)
    savingsScore: number;     // 0–150   (savings rate)
  };
  calculatedAt: string;
}

export interface FinanceResult<T = void> {
  success: boolean;
  message: string;
  data?: T;
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function generateId(): string {
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).substring(2)}`;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function addDays(dateStr: string, n: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function shortLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

async function getRawTransactions(): Promise<Transaction[]> {
  try {
    const raw = await sGet(KEYS.TRANSACTIONS);
    return raw ? (JSON.parse(raw) as Transaction[]) : [];
  } catch { return []; }
}

async function saveTransactions(txns: Transaction[]): Promise<void> {
  await sSet(KEYS.TRANSACTIONS, JSON.stringify(txns));
}

// ─── Credit Score Formula ─────────────────────────────────────────────────────
// Total max = 850, min = 300

function computeCreditScore(
  profile: FinanceProfile,
  transactions: Transaction[]
): CreditRecord {
  const { netWorthUSD, monthlyIncome, monthlyExpenses } = profile;

  const monthlyIncomeUSD = toUSD(monthlyIncome, profile.currency);
  const monthlyExpensesUSD = toUSD(monthlyExpenses, profile.currency);

  // 1. Net worth score (0–200)
  //    $0 → 0pts, $10k → 100pts, $100k+ → 200pts
  const netWorthScore = Math.min(200, Math.round((netWorthUSD / 100_000) * 200));

  // 2. Income-to-expense ratio score (0–200)
  //    ratio ≥ 2.0 → 200pts, ratio = 1.0 → 100pts, ratio ≤ 0 → 0pts
  const ratio = monthlyExpensesUSD > 0 ? monthlyIncomeUSD / monthlyExpensesUSD : 2;
  const incomeRatioScore = Math.min(200, Math.max(0, Math.round(ratio * 100)));

  // 3. Activity score (0–150)
  //    More regular transactions = better financial awareness
  //    10+ transactions in 30 days → 150pts
  const last30days = new Date();
  last30days.setDate(last30days.getDate() - 30);
  const recentTxns = transactions.filter(
    (t) => new Date(t.date) >= last30days
  );
  const activityScore = Math.min(150, recentTxns.length * 15);

  // 4. Consistency score (0–150)
  //    % of transaction days where income >= expenses → full marks if always positive
  const dayMap: Record<string, { inc: number; exp: number }> = {};
  transactions.forEach((t) => {
    const d = t.date.split("T")[0];
    if (!dayMap[d]) dayMap[d] = { inc: 0, exp: 0 };
    if (t.type === "income") dayMap[d].inc += t.amountUSD;
    else dayMap[d].exp += t.amountUSD;
  });
  const days = Object.values(dayMap);
  const positiveDays = days.filter((d) => d.inc >= d.exp).length;
  const consistencyScore =
    days.length > 0 ? Math.round((positiveDays / days.length) * 150) : 75;

  // 5. Savings rate score (0–150)
  //    savingsRate = (income - expenses) / income
  //    20%+ savings rate → 150pts
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amountUSD, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amountUSD, 0);
  const savingsRate =
    totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0;
  const savingsScore = Math.min(150, Math.max(0, Math.round(savingsRate * 750)));

  const rawScore =
    300 +
    netWorthScore +
    incomeRatioScore +
    activityScore +
    consistencyScore +
    savingsScore;

  const score = Math.min(850, Math.max(300, rawScore));

  const grade =
    score >= 800 ? "Exceptional"
    : score >= 740 ? "Very Good"
    : score >= 670 ? "Good"
    : score >= 580 ? "Fair"
    : "Poor";

  return {
    score,
    grade,
    breakdown: {
      netWorthScore,
      incomeRatioScore,
      activityScore,
      consistencyScore,
      savingsScore,
    },
    calculatedAt: new Date().toISOString(),
  };
}

// ─── 5-Day Timeline Generator ─────────────────────────────────────────────────

function generateTimeline(
  profile: FinanceProfile,
  transactions: Transaction[]
): DaySnapshot[] {
  const today = todayStr();

  // Daily averages from estimates
  const dailyIncomeUSD = toUSD(profile.monthlyIncome, profile.currency) / 30;
  const dailyExpenseUSD = toUSD(profile.monthlyExpenses, profile.currency) / 30;

  // Group real transactions by date
  const txnsByDay: Record<string, { inc: number; exp: number }> = {};
  transactions.forEach((t) => {
    const d = t.date.split("T")[0];
    if (!txnsByDay[d]) txnsByDay[d] = { inc: 0, exp: 0 };
    if (t.type === "income") txnsByDay[d].inc += t.amountUSD;
    else txnsByDay[d].exp += t.amountUSD;
  });

  const snapshots: DaySnapshot[] = [];
  let runningNetWorth = profile.netWorthUSD;

  for (let i = 0; i < 5; i++) {
    const dateStr = addDays(today, i - 4); // days: today-4 → today
    const label = i === 4 ? "Today" : `Day ${i + 1}`;
    const hasRealData = !!txnsByDay[dateStr];

    const incomeUSD = hasRealData ? txnsByDay[dateStr].inc : dailyIncomeUSD;
    const expenseUSD = hasRealData ? txnsByDay[dateStr].exp : dailyExpenseUSD;

    runningNetWorth += incomeUSD - expenseUSD;

    // Fake credit score shift per day for the timeline
    const creditRecord = computeCreditScore(
      { ...profile, netWorthUSD: runningNetWorth },
      transactions.filter((t) => new Date(t.date) <= new Date(dateStr))
    );

    snapshots.push({
      date: dateStr,
      label: `${label}\n${shortLabel(dateStr)}`,
      netWorthUSD: parseFloat(runningNetWorth.toFixed(2)),
      incomeUSD: parseFloat(incomeUSD.toFixed(2)),
      expenseUSD: parseFloat(expenseUSD.toFixed(2)),
      creditScore: creditRecord.score,
      isProjected: !hasRealData,
    });
  }

  return snapshots;
}


export async function setupFinances(
  netWorth: number,
  currency: Currency,
  monthlyIncome: number,
  monthlyExpenses: number,
  bankName: string,
  bankCode: string
): Promise<FinanceResult<FinanceProfile>> {
  try {
    if (netWorth < 0)
      return { success: false, message: "Net worth cannot be negative." };
    if (monthlyIncome < 0 || monthlyExpenses < 0)
      return { success: false, message: "Income and expenses must be positive." };

    const profile: FinanceProfile = {
      netWorth,
      currency,
      netWorthUSD: toUSD(netWorth, currency),
      monthlyIncome,
      monthlyExpenses,
      bankName,
      bankCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await sSet(KEYS.PROFILE, JSON.stringify(profile));

    // Generate initial timeline & credit score
    const txns = await getRawTransactions();
    const timeline = generateTimeline(profile, txns);
    await sSet(KEYS.TIMELINE, JSON.stringify(timeline));

    const credit = computeCreditScore(profile, txns);
    await sSet(KEYS.CREDIT, JSON.stringify(credit));

    return { success: true, message: "Finances set up successfully.", data: profile };
  } catch (e) {
    console.error("[finances] setupFinances error:", e);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

/** Returns the stored finance profile, or null if not set up yet */
export async function getFinanceProfile(): Promise<FinanceProfile | null> {
  try {
    const raw = await sGet(KEYS.PROFILE);
    return raw ? (JSON.parse(raw) as FinanceProfile) : null;
  } catch { return null; }
}

/** Update net worth (e.g. after manual correction) */
export async function updateNetWorth(
  newNetWorth: number
): Promise<FinanceResult> {
  try {
    const profile = await getFinanceProfile();
    if (!profile) return { success: false, message: "Finance profile not found. Run setupFinances first." };

    profile.netWorth = newNetWorth;
    profile.netWorthUSD = toUSD(newNetWorth, profile.currency);
    profile.updatedAt = new Date().toISOString();

    await sSet(KEYS.PROFILE, JSON.stringify(profile));
    await refreshTimlineAndCredit(profile);
    return { success: true, message: "Net worth updated." };
  } catch (e) {
    console.error("[finances] updateNetWorth error:", e);
    return { success: false, message: "Something went wrong." };
  }
}

// ─── Transactions ─────────────────────────────────────────────────────────────

/** Add an income or expense transaction */
export async function addTransaction(
  type: TransactionType,
  amount: number,
  currency: Currency,
  category: TransactionCategory,
  note: string = ""
): Promise<FinanceResult<Transaction>> {
  try {
    if (amount <= 0)
      return { success: false, message: "Amount must be greater than 0." };

    const profile = await getFinanceProfile();
    if (!profile)
      return { success: false, message: "Finance profile not found. Run setupFinances first." };

    const txn: Transaction = {
      id: generateId(),
      type,
      amount,
      currency,
      amountUSD: toUSD(amount, currency),
      category,
      note: note.trim(),
      date: new Date().toISOString(),
    };

    const txns = await getRawTransactions();
    txns.push(txn);
    await saveTransactions(txns);

    // Update net worth based on transaction
    const delta = type === "income" ? txn.amountUSD : -txn.amountUSD;
    profile.netWorthUSD += delta;
    profile.netWorth = fromUSD(profile.netWorthUSD, profile.currency);
    profile.updatedAt = new Date().toISOString();
    await sSet(KEYS.PROFILE, JSON.stringify(profile));

    // Refresh timeline + credit after every transaction
    await refreshTimlineAndCredit(profile);

    return { success: true, message: `${type === "income" ? "Income" : "Expense"} added.`, data: txn };
  } catch (e) {
    console.error("[finances] addTransaction error:", e);
    return { success: false, message: "Something went wrong." };
  }
}

/** Delete a transaction by id and recalculate */
export async function deleteTransaction(id: string): Promise<FinanceResult> {
  try {
    const txns = await getRawTransactions();
    const index = txns.findIndex((t) => t.id === id);
    if (index === -1)
      return { success: false, message: "Transaction not found." };

    const [removed] = txns.splice(index, 1);
    await saveTransactions(txns);

    // Reverse the net worth effect
    const profile = await getFinanceProfile();
    if (profile) {
      const delta = removed.type === "income" ? -removed.amountUSD : removed.amountUSD;
      profile.netWorthUSD += delta;
      profile.netWorth = fromUSD(profile.netWorthUSD, profile.currency);
      profile.updatedAt = new Date().toISOString();
      await sSet(KEYS.PROFILE, JSON.stringify(profile));
      await refreshTimlineAndCredit(profile);
    }

    return { success: true, message: "Transaction deleted." };
  } catch (e) {
    console.error("[finances] deleteTransaction error:", e);
    return { success: false, message: "Something went wrong." };
  }
}

/** Get all transactions, newest first */
export async function getTransactions(): Promise<Transaction[]> {
  const txns = await getRawTransactions();
  return txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/** Get only income transactions */
export async function getIncomes(): Promise<Transaction[]> {
  const txns = await getTransactions();
  return txns.filter((t) => t.type === "income");
}

/** Get only expense transactions */
export async function getExpenses(): Promise<Transaction[]> {
  const txns = await getTransactions();
  return txns.filter((t) => t.type === "expense");
}

// ─── Credit Score ─────────────────────────────────────────────────────────────

/** Returns the latest computed credit score record */
export async function getCreditScore(): Promise<CreditRecord | null> {
  try {
    const raw = await sGet(KEYS.CREDIT);
    return raw ? (JSON.parse(raw) as CreditRecord) : null;
  } catch { return null; }
}

/** Force-recalculate credit score from current data */
export async function recalculateCreditScore(): Promise<FinanceResult<CreditRecord>> {
  try {
    const profile = await getFinanceProfile();
    if (!profile)
      return { success: false, message: "Finance profile not found." };

    const txns = await getRawTransactions();
    const credit = computeCreditScore(profile, txns);
    await sSet(KEYS.CREDIT, JSON.stringify(credit));
    return { success: true, message: "Credit score updated.", data: credit };
  } catch (e) {
    console.error("[finances] recalculateCreditScore error:", e);
    return { success: false, message: "Something went wrong." };
  }
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

/** Returns the 5-day timeline (mix of projected + actual snapshots) */
export async function getTimeline(): Promise<DaySnapshot[]> {
  try {
    const raw = await sGet(KEYS.TIMELINE);
    return raw ? (JSON.parse(raw) as DaySnapshot[]) : [];
  } catch { return []; }
}

/** Force-regenerate the 5-day timeline */
export async function refreshTimeline(): Promise<FinanceResult<DaySnapshot[]>> {
  try {
    const profile = await getFinanceProfile();
    if (!profile)
      return { success: false, message: "Finance profile not found." };
    const txns = await getRawTransactions();
    const timeline = generateTimeline(profile, txns);
    await sSet(KEYS.TIMELINE, JSON.stringify(timeline));
    return { success: true, message: "Timeline refreshed.", data: timeline };
  } catch (e) {
    console.error("[finances] refreshTimeline error:", e);
    return { success: false, message: "Something went wrong." };
  }
}

// ─── Summary ──────────────────────────────────────────────────────────────────

export interface FinanceSummary {
  profile: FinanceProfile;
  credit: CreditRecord;
  timeline: DaySnapshot[];
  totalIncome: number;       // USD
  totalExpenses: number;     // USD
  netFlow: number;           // USD  (income - expenses)
  transactionCount: number;
}

/** One-shot call to get everything needed for a dashboard */
export async function getFinanceSummary(): Promise<FinanceSummary | null> {
  try {
    const profile = await getFinanceProfile();
    if (!profile) return null;

    const [txns, creditRaw, timelineRaw] = await Promise.all([
      getRawTransactions(),
      sGet(KEYS.CREDIT),
      sGet(KEYS.TIMELINE),
    ]);

    const credit: CreditRecord = creditRaw
      ? JSON.parse(creditRaw)
      : computeCreditScore(profile, txns);

    const timeline: DaySnapshot[] = timelineRaw
      ? JSON.parse(timelineRaw)
      : generateTimeline(profile, txns);

    const totalIncome = txns
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amountUSD, 0);

    const totalExpenses = txns
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amountUSD, 0);

    return {
      profile,
      credit,
      timeline,
      totalIncome: parseFloat(totalIncome.toFixed(2)),
      totalExpenses: parseFloat(totalExpenses.toFixed(2)),
      netFlow: parseFloat((totalIncome - totalExpenses).toFixed(2)),
      transactionCount: txns.length,
    };
  } catch (e) {
    console.error("[finances] getFinanceSummary error:", e);
    return null;
  }
}

// ─── Reset ────────────────────────────────────────────────────────────────────

/** Wipe all finance data (useful for logout / account deletion) */
export async function clearFinances(): Promise<void> {
  await Promise.all([
    sDel(KEYS.PROFILE),
    sDel(KEYS.TRANSACTIONS),
    sDel(KEYS.TIMELINE),
    sDel(KEYS.CREDIT),
  ]);
}

// ─── Internal refresh helper ──────────────────────────────────────────────────

async function refreshTimlineAndCredit(profile: FinanceProfile): Promise<void> {
  const txns = await getRawTransactions();
  const [timeline, credit] = [
    generateTimeline(profile, txns),
    computeCreditScore(profile, txns),
  ];
  await Promise.all([
    sSet(KEYS.TIMELINE, JSON.stringify(timeline)),
    sSet(KEYS.CREDIT, JSON.stringify(credit)),
  ]);
}