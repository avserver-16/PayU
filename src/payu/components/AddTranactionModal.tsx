import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  ScrollView,
} from 'react-native';
import {
  addTransaction,
  Currency,
  Transaction,
  TransactionCategory,
  TransactionType,
} from '../../../localstorage-services/finances';

// ─── Config ───────────────────────────────────────────────────────────────────

const CURRENCIES: Currency[] = ['USD', 'CAD', 'INR'];

const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: '$',
  CAD: 'CA$',
  INR: '₹',
};

const INCOME_CATEGORIES: { label: string; value: TransactionCategory }[] = [
  { label: 'Salary',     value: 'salary' },
  { label: 'Freelance',  value: 'freelance' },
  { label: 'Investment', value: 'investment' },
  { label: 'Gift',       value: 'gift' },
  { label: 'Other',      value: 'other' },
];

const EXPENSE_CATEGORIES: { label: string; value: TransactionCategory }[] = [
  { label: 'Food',          value: 'food' },
  { label: 'Transport',     value: 'transport' },
  { label: 'Shopping',      value: 'shopping' },
  { label: 'Bills',         value: 'bills' },
  { label: 'Healthcare',    value: 'healthcare' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Other',         value: 'other' },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface AddTransactionModalProps {
  showAddTransactionModal: boolean;
  setShowAddTransactionModal: (show: boolean) => void;
  onSuccess?: (transaction: Transaction) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AddTransactionModal = ({
  showAddTransactionModal,
  setShowAddTransactionModal,
  onSuccess,
}: AddTransactionModalProps) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>('food');
  const [note, setNote] = useState('');
//   const [bankName, setBankName] = useState('');
//   const [bankCode, setBankCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const symbol = CURRENCY_SYMBOL[currency];
  const isIncome = type === 'income';
  const categories = isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const selectedCategoryLabel = categories.find((c) => c.value === category)?.label ?? 'Select';

  const handleTypeSwitch = (t: TransactionType) => {
    setType(t);
    setCategory(t === 'income' ? 'salary' : 'food');
    setCategoryOpen(false);
    setError(null);
  };

  const handleClose = () => {
    setType('expense');
    setCurrency('USD');
    setAmount('');
    setCategory('food');
    setNote('');
    // setBankName('');
    // setBankCode('');
    setError(null);
    setCategoryOpen(false);
    setShowAddTransactionModal(false);
  };

  const handleSubmit = async () => {
    setError(null);

    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0)
      return setError('Please enter a valid amount greater than 0.');
    // if (!bankName.trim())
    //   return setError('Please enter a bank name.');
    // if (bankCode.replace(/\s/g, '').length !== 16)
    //   return setError('Bank card number must be 16 digits.');

    setLoading(true);
    const result = await addTransaction(type, parsed, currency, category, note);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    if (result.data) onSuccess?.(result.data);
    handleClose();
  };

  return (
    <Modal
      visible={showAddTransactionModal}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={modal.overlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%', alignItems: 'center' }}
          >
            <View style={modal.card}>

              {/* Header */}
              <View style={modal.headerRow}>
                <View>
                  <Text style={modal.title}>Add Transaction</Text>
                  <Text style={modal.subtitle}>Add a new transaction to your account.</Text>
                </View>
                <TouchableOpacity onPress={handleClose} style={modal.closeBtn}>
                  <Text style={modal.closeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

                {/* Income / Expense toggle */}
                <View style={modal.typeToggle}>
                  <TouchableOpacity
                    style={[modal.typeBtn, !isIncome && modal.typeBtnActiveExpense]}
                    onPress={() => handleTypeSwitch('expense')}
                  >
                    <Text style={[modal.typeBtnText, !isIncome && modal.typeBtnTextActive]}>
                      ↓  Expense
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[modal.typeBtn, isIncome && modal.typeBtnActiveIncome]}
                    onPress={() => handleTypeSwitch('income')}
                  >
                    <Text style={[modal.typeBtnText, isIncome && modal.typeBtnTextActive]}>
                      ↑  Income
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Currency */}
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

                {/* Amount */}
                <Text style={modal.label}>Amount</Text>
                <View style={modal.inputRow}>
                  <Text style={modal.prefix}>{symbol}</Text>
                  <TextInput
                    style={modal.input}
                    placeholder="0.00"
                    placeholderTextColor="#555"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                  />
                </View>

                {/* Category — native inline dropdown (no 3rd party lib) */}
                <Text style={modal.label}>Category</Text>
                <TouchableOpacity
                  style={modal.inputRow}
                  onPress={() => setCategoryOpen((o) => !o)}
                  activeOpacity={0.8}
                >
                  <Text style={[modal.input, { color: '#FAFAFA' ,top:12}]}>{selectedCategoryLabel}</Text>
                  <Text style={modal.prefix}>{categoryOpen ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {categoryOpen && (
                  <View style={modal.dropdownList}>
                    {categories.map((cat) => (
                      <TouchableOpacity
                        key={cat.value}
                        style={[
                          modal.dropdownItem,
                          category === cat.value && modal.dropdownItemActive,
                        ]}
                        onPress={() => {
                          setCategory(cat.value);
                          setCategoryOpen(false);
                        }}
                      >
                        <Text style={[
                          modal.dropdownItemText,
                          category === cat.value && modal.dropdownItemTextActive,
                        ]}>
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Note */}
                <Text style={modal.label}>
                  Note <Text style={modal.optional}>(optional)</Text>
                </Text>
                <View style={modal.inputRow}>
                  <TextInput
                    style={modal.input}
                    placeholder="e.g. Monthly groceries"
                    placeholderTextColor="#555"
                    value={note}
                    onChangeText={setNote}
                    maxLength={120}
                  />
                </View>

                {/* Bank Name */}
                {/* <Text style={modal.label}>Bank Name</Text>
                <View style={modal.inputRow}>
                  <TextInput
                    style={modal.input}
                    placeholder="e.g. Chase, TD Bank"
                    placeholderTextColor="#555"
                    value={bankName}
                    onChangeText={setBankName}
                  />
                </View> */}

                {/* Bank Code */}
                {/* <Text style={modal.label}>Bank Card Number</Text>
                <View style={modal.inputRow}>
                  <TextInput
                    style={modal.input}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#555"
                    keyboardType="numeric"
                    maxLength={16}
                    value={bankCode}
                    onChangeText={setBankCode}
                  />
                </View>
                <Text style={modal.hint}>16-digit card number</Text> */}

                {/* Error */}
                {error ? <Text style={modal.error}>{error}</Text> : null}

                {/* Submit */}
                <TouchableOpacity
                  style={[
                    modal.btn,
                    isIncome ? modal.btnIncome : modal.btnExpense,
                    loading && modal.btnDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#171717" />
                  ) : (
                    <Text style={modal.btnText}>
                      {isIncome ? '↓ Add Income' : '↑ Add Expense'}
                    </Text>
                  )}
                </TouchableOpacity>

              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default AddTransactionModal;

// ─── Styles ───────────────────────────────────────────────────────────────────

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
    backgroundColor: '#141414',
    borderRadius: 24,
    padding: 24,
    borderWidth: 0.5,
    borderColor: '#2E2E2E',
    maxHeight: '90%',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    color: '#FAFAFA',
    fontSize: 18,
    fontWeight: '700',
  },
  subtitle: {
    color: '#A1A1A1',
    fontSize: 12,
    marginTop: 3,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#A1A1A1',
    fontSize: 11,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 4,
    marginBottom: 4,
    borderWidth: 0.5,
    borderColor: '#2E2E2E',
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeBtnActiveExpense: {
    backgroundColor: '#FF6B6B22',
    borderWidth: 0.5,
    borderColor: '#FF6B6B66',
  },
  typeBtnActiveIncome: {
    backgroundColor: '#4ADE8022',
    borderWidth: 0.5,
    borderColor: '#4ADE8066',
  },
  typeBtnText: {
    color: '#555',
    fontSize: 13,
    fontWeight: '600',
  },
  typeBtnTextActive: {
    color: '#FAFAFA',
  },
  label: {
    color: '#FAFAFA',
    fontSize: 13,
    marginBottom: 6,
    marginTop: 14,
  },
  optional: {
    color: '#555',
    fontSize: 12,
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
    height: '100%',
    color: '#FAFAFA',
    fontSize: 14,
  },
  hint: {
    color: '#555',
    fontSize: 11,
    marginTop: 4,
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
    borderColor: '#262626',
    alignItems: 'center',
    backgroundColor: '#2626264D',
  },
  currencyBtnActive: {
    backgroundColor: '#FAFAFA',
    borderColor: '#FAFAFA',
  },
  currencyText: {
    color: '#A1A1A1',
    fontSize: 12,
    fontWeight: '600',
  },
  currencyTextActive: {
    color: '#171717',
  },
  dropdownList: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#2E2E2E',
    marginTop: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2E2E2E',
  },
  dropdownItemActive: {
    backgroundColor: '#26262680',
  },
  dropdownItemText: {
    color: '#A1A1A1',
    fontSize: 14,
  },
  dropdownItemTextActive: {
    color: '#FAFAFA',
    fontWeight: '600',
  },
  error: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 10,
  },
  btn: {
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 4,
  },
  btnIncome: { backgroundColor: '#4ADE80' },
  btnExpense: { backgroundColor: '#FAFAFA' },
  btnDisabled: { opacity: 0.5 },
  btnText: {
    color: '#171717',
    fontWeight: '600',
    fontSize: 14,
  },
});