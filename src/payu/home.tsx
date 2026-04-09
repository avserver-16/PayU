import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import GradientBackground from '../../styles/Background';
import Header from './components/Header';
import BankCard from './components/BankCard';
import ExpenseCard from './components/ExpenseCard';
import { getCurrentUser } from '../../localstorage-services/auth';
import {
  getFinanceProfile,
  setupFinances,
  Currency,
  FinanceProfile,
  getTransactions,
} from '../../localstorage-services/finances';
import AddTransactionModal from './components/AddTranactionModal';

type UserData = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
};

const CURRENCIES: Currency[] = ['USD', 'CAD', 'INR'];

const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: '$',
  CAD: 'CA$',
  INR: '₹',
};

// POPUP

const FinanceSetupModal = ({
  visible,
  onComplete,
}: {
  visible: boolean;
  onComplete: () => void;
}) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [netWorth, setNetWorth] = useState('');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [bankName, setBankName] = useState('');
  const [bankCode, setBankCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const symbol = CURRENCY_SYMBOL[currency];

  const handleSubmit = async () => {
    setError(null);

    const nw = parseFloat(netWorth);
    const mi = parseFloat(monthlyIncome);
    const me = parseFloat(monthlyExpenses);

    if (isNaN(nw) || nw < 0)
      return setError('Please enter a valid net worth.');
    if (isNaN(mi) || mi <= 0)
      return setError('Please enter your monthly income.');
    if (isNaN(me) || me < 0)
      return setError('Please enter your monthly expenses.');

    setLoading(true);
    const result = await setupFinances(nw, currency, mi, me, bankName, bankCode);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    onComplete();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={modal.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%', alignItems: 'center' }}
          >
            <View style={modal.card}>
              {/* Header */}
              <Text style={modal.title}>Set Up Your Finances</Text>
              <Text style={modal.subtitle}>
                Tell us a bit about your finances to get started with personalised insights.
              </Text>

              {/* Currency picker */}
              <Text style={modal.label}>Currency</Text>
              <View style={modal.currencyRow}>
                {CURRENCIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[modal.currencyBtn, currency === c && modal.currencyBtnActive]}
                    onPress={() => setCurrency(c)}
                  >
                    <Text style={[modal.currencyText, currency === c && modal.currencyTextActive]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Net worth */}
              <Text style={modal.label}>Current Net Worth</Text>
              <View style={modal.inputRow}>
                <Text style={modal.prefix}>{symbol}</Text>
                <TextInput
                  style={modal.input}
                  placeholder="0.00"
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                  value={netWorth}
                  onChangeText={setNetWorth}
                />
              </View>

              {/* Monthly income */}
              <Text style={modal.label}>Monthly Income</Text>
              <View style={modal.inputRow}>
                <Text style={modal.prefix}>{symbol}</Text>
                <TextInput
                  style={modal.input}
                  placeholder="0.00"
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                  value={monthlyIncome}
                  onChangeText={setMonthlyIncome}
                />
              </View>

              {/* Monthly expenses */}
              <Text style={modal.label}>Monthly Expenses</Text>
              <View style={modal.inputRow}>
                <Text style={modal.prefix}>{symbol}</Text>
                <TextInput
                  style={modal.input}
                  placeholder="0.00"
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                  value={monthlyExpenses}
                  onChangeText={setMonthlyExpenses}
                />
              </View>
              <Text style={modal.label}>Bank Name</Text>
              <View style={modal.inputRow}>
                <Text style={modal.prefix}>{symbol}</Text>
                <TextInput
                  style={modal.input}
                  placeholder="Bank Name"
                  placeholderTextColor="#555"
                  value={bankName}
                  onChangeText={setBankName}
                />
              </View>
              <Text style={modal.label}>Bank Code</Text>
              <View style={modal.inputRow}>
                <Text style={modal.prefix}>{symbol}</Text>
                <TextInput
                  style={modal.input}
                  placeholder="Bank Code"
                  placeholderTextColor="#555"
                  value={bankCode}
                  onChangeText={setBankCode}
                />
              </View>
              <Text style={modal.prefix}>16-digit Bank Code</Text>

              {/* Error */}
              {error ? <Text style={modal.error}>{error}</Text> : null}

              {/* Submit */}
              <TouchableOpacity
                style={[modal.btn, loading && modal.btnDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#171717" />
                ) : (
                  <Text style={modal.btnText}>Get Started</Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};










// ─── Home Page ────────────────────────────────────────────────────────────────

const HomePage = () => {
  const [period, setPeriod] = useState<'weekly' | 'monthly'>('weekly');
  const [user, setUser] = useState<UserData | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [profile, setProfile] = useState<FinanceProfile | null>(null);
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  useEffect(() => {
    const init = async () => {
      // Load user
      const userData = await getCurrentUser();
      if (userData) setUser(userData);

      // Check if finance profile exists — show popup if not
      const profile = await getFinanceProfile();
      if (!profile) setShowSetup(true);
      setProfile(profile);
      // console.log("profile", profile);

      const transactions = await getTransactions();
      console.log("transactions", transactions);
      setTransactions(transactions);
    };

    init();
  }, []);

  return (
    <GradientBackground>

      <Header title="PayU" />

      {/* First-entry finance setup popup */}
      <FinanceSetupModal
        visible={showSetup}
        onComplete={() => setShowSetup(false)}
      />
     <AddTransactionModal 
      showAddTransactionModal={showAddTransactionModal}
      setShowAddTransactionModal={setShowAddTransactionModal}
     />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>Hey, {user?.fullName || 'User'}</Text>
          <Text style={styles.greetingSubtitle}>Add your yesterday's expense</Text>
        </View>

        {/* Bank Card */}
        <View style={styles.cardContainer}>
          <BankCard holderName={user?.fullName || 'User'} financeProfile={profile} />
        </View>

        {/* Expenses Section */}
        <View>
          <Text style={styles.sectionTitle}>Your Expenses</Text>

          {/* Weekly / Monthly Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, period === 'weekly' && styles.activeToggle]}
              onPress={() => setPeriod('weekly')}
            >
              <Text style={[styles.toggleText, period === 'weekly' && styles.activeToggleText]}>
                Weekly
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.toggleButton, period === 'monthly' && styles.activeToggle]}
              onPress={() => setPeriod('monthly')}
            >
              <Text style={[styles.toggleText, period === 'monthly' && styles.activeToggleText]}>
                Monthly
              </Text>
            </TouchableOpacity>
          </View>

          {/* Expense Cards */}
          <View style={styles.expenseList}>
            {period === 'weekly' ? (
              <>
                {transactions.map((transaction) => (
                  <ExpenseCard key={transaction.id} title={transaction.category} description={transaction.note} price={`$${transaction.amount}`} />
                ))}
              </>
            ) : (
              <>
                {transactions.map((transaction) => (
                  <ExpenseCard key={transaction.id} title={transaction.category} description={transaction.note} price={`$${transaction.amount}`} />
                ))}
              </>
            )}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity onPress={() => setShowAddTransactionModal(true)} style={{ position: 'absolute', bottom: 50, right: 30, height: 50, width: 50, backgroundColor: '#FAFAFA', borderRadius: 100, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 30, color: '#000' }}>+</Text>
      </TouchableOpacity>
    </GradientBackground>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 24,
    paddingBottom: 100,
  },
  greetingContainer: {
    gap: 8,
    marginBottom: 12,
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FAFAFA',
  },
  greetingSubtitle: {
    fontSize: 16,
    color: '#A1A1A1',
  },
  cardContainer: {
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FAFAFA',
    marginBottom: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#262626',
    borderRadius: 100,
    padding: 8,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 4,
    alignItems: 'center',
    borderRadius: 100,
  },
  activeToggle: {
    backgroundColor: '#FAFAFA',
  },
  toggleText: {
    color: '#A1A1A1',
    fontSize: 14,
  },
  activeToggleText: {
    color: '#000',
  },
  expenseList: {
    gap: 12,
  },
});

const modal = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 24,
    borderWidth: 0.5,
    borderColor: '#2E2E2E',
  },
  title: {
    color: '#FAFAFA',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    color: '#A1A1A1',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 20,
  },
  label: {
    color: '#FAFAFA',
    fontSize: 13,
    marginBottom: 6,
    marginTop: 12,
  },
  currencyRow: {
    flexDirection: 'row',
    gap: 8,
  },
  currencyBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#333',
    alignItems: 'center',
    backgroundColor: '#262626',
  },
  currencyBtnActive: {
    backgroundColor: '#FAFAFA',
    borderColor: '#FAFAFA',
  },
  currencyText: {
    color: '#A1A1A1',
    fontSize: 13,
    fontWeight: '600',
  },
  currencyTextActive: {
    color: '#171717',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderWidth: 0.5,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#2626264D',
    borderColor: '#262626',
    gap: 6,
  },
  prefix: {
    color: '#A1A1A1',
    fontSize: 14,
  },
  input: {
    flex: 1,
    color: '#FAFAFA',
    fontSize: 14,
    height: '100%',
  },
  error: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 10,
  },
  btn: {
    height: 40,
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: '#171717',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HomePage;