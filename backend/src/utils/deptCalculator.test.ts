

import { calculateSimplifiedDebts } from './deptCalculator.js';


export interface UserBalance {
  UserId: string;
  UserName: string;
  NetBalanceAmount: number;
}

describe("calculateSimplifiedDebts", () => {
  it("returns no transactions when there are no balances", () => {
    const balances: UserBalance[] = [];

    expect(calculateSimplifiedDebts(balances)).toEqual([]);
  });

  it("creates one transaction when one debtor owes one creditor", () => {
    const balances: UserBalance[] = [
      {
        UserId: "alice",
        UserName: "Alice",
        NetBalanceAmount: -50,
      },
      {
        UserId: "bob",
        UserName: "Bob",
        NetBalanceAmount: 50,
      },
    ];

    expect(calculateSimplifiedDebts(balances)).toEqual([
      {
        fromUserId: "alice",
        fromUserName: "Alice",
        toUserId: "bob",
        toUserName: "Bob",
        amount: 50,
      },
    ]);
  });

  it("does not create transactions when there are only debtors", () => {
    const balances: UserBalance[] = [
      {
        UserId: "alice",
        UserName: "Alice",
        NetBalanceAmount: -50,
      },
      {
        UserId: "bob",
        UserName: "Bob",
        NetBalanceAmount: -30,
      },
    ];

    expect(calculateSimplifiedDebts(balances)).toEqual([]);
  });

  it("does not create transactions when there are only creditors", () => {
    const balances: UserBalance[] = [
      {
        UserId: "alice",
        UserName: "Alice",
        NetBalanceAmount: 50,
      },
      {
        UserId: "bob",
        UserName: "Bob",
        NetBalanceAmount: 30,
      },
    ];

    expect(calculateSimplifiedDebts(balances)).toEqual([]);
  });

  it("ignores users whose balance is exactly zero", () => {
    const balances: UserBalance[] = [
      {
        UserId: "alice",
        UserName: "Alice",
        NetBalanceAmount: -50,
      },
      {
        UserId: "bob",
        UserName: "Bob",
        NetBalanceAmount: 50,
      },
      {
        UserId: "charlie",
        UserName: "Charlie",
        NetBalanceAmount: 0,
      },
    ];

    expect(calculateSimplifiedDebts(balances)).toEqual([
      {
        fromUserId: "alice",
        fromUserName: "Alice",
        toUserId: "bob",
        toUserName: "Bob",
        amount: 50,
      },
    ]);
  });

  it("treats balances of exactly plus or minus 0.01 as settled", () => {
    const balances: UserBalance[] = [
      {
        UserId: "alice",
        UserName: "Alice",
        NetBalanceAmount: -0.01,
      },
      {
        UserId: "bob",
        UserName: "Bob",
        NetBalanceAmount: 0.01,
      },
    ];

    expect(calculateSimplifiedDebts(balances)).toEqual([]);
  });

  it("includes balances just beyond the 0.01 threshold", () => {
    const balances: UserBalance[] = [
      {
        UserId: "alice",
        UserName: "Alice",
        NetBalanceAmount: -0.02,
      },
      {
        UserId: "bob",
        UserName: "Bob",
        NetBalanceAmount: 0.02,
      },
    ];

    expect(calculateSimplifiedDebts(balances)).toEqual([
      {
        fromUserId: "alice",
        fromUserName: "Alice",
        toUserId: "bob",
        toUserName: "Bob",
        amount: 0.02,
      },
    ]);
  });

  it("splits one debtor's balance across multiple creditors", () => {
    const balances: UserBalance[] = [
      {
        UserId: "alice",
        UserName: "Alice",
        NetBalanceAmount: -100,
      },
      {
        UserId: "bob",
        UserName: "Bob",
        NetBalanceAmount: 60,
      },
      {
        UserId: "charlie",
        UserName: "Charlie",
        NetBalanceAmount: 40,
      },
    ];

    expect(calculateSimplifiedDebts(balances)).toEqual([
      {
        fromUserId: "alice",
        fromUserName: "Alice",
        toUserId: "bob",
        toUserName: "Bob",
        amount: 60,
      },
      {
        fromUserId: "alice",
        fromUserName: "Alice",
        toUserId: "charlie",
        toUserName: "Charlie",
        amount: 40,
      },
    ]);
  });

  it("combines multiple debtors into payments to one creditor", () => {
    const balances: UserBalance[] = [
      {
        UserId: "alice",
        UserName: "Alice",
        NetBalanceAmount: -60,
      },
      {
        UserId: "bob",
        UserName: "Bob",
        NetBalanceAmount: -40,
      },
      {
        UserId: "charlie",
        UserName: "Charlie",
        NetBalanceAmount: 100,
      },
    ];

    expect(calculateSimplifiedDebts(balances)).toEqual([
      {
        fromUserId: "alice",
        fromUserName: "Alice",
        toUserId: "charlie",
        toUserName: "Charlie",
        amount: 60,
      },
      {
        fromUserId: "bob",
        fromUserName: "Bob",
        toUserId: "charlie",
        toUserName: "Charlie",
        amount: 40,
      },
    ]);
  });

  it("continues settling a debtor after completely paying one creditor", () => {
    const balances: UserBalance[] = [
      {
        UserId: "alice",
        UserName: "Alice",
        NetBalanceAmount: -100,
      },
      {
        UserId: "bob",
        UserName: "Bob",
        NetBalanceAmount: 30,
      },
      {
        UserId: "charlie",
        UserName: "Charlie",
        NetBalanceAmount: 70,
      },
    ];

    expect(calculateSimplifiedDebts(balances)).toEqual([
      {
        fromUserId: "alice",
        fromUserName: "Alice",
        toUserId: "charlie",
        toUserName: "Charlie",
        amount: 70,
      },
      {
        fromUserId: "alice",
        fromUserName: "Alice",
        toUserId: "bob",
        toUserName: "Bob",
        amount: 30,
      },
    ]);
  });

  it("matches larger balances first regardless of input order", () => {
    const balances: UserBalance[] = [
      {
        UserId: "alice",
        UserName: "Alice",
        NetBalanceAmount: -40,
      },
      {
        UserId: "bob",
        UserName: "Bob",
        NetBalanceAmount: 20,
      },
      {
        UserId: "charlie",
        UserName: "Charlie",
        NetBalanceAmount: 40,
      },
    ];

    expect(calculateSimplifiedDebts(balances)).toEqual([
      {
        fromUserId: "alice",
        fromUserName: "Alice",
        toUserId: "charlie",
        toUserName: "Charlie",
        amount: 40,
      },
    ]);
  });

  it("preserves user identity and names in each transaction", () => {
    const balances: UserBalance[] = [
      {
        UserId: "user-123",
        UserName: "Alice Smith",
        NetBalanceAmount: -25,
      },
      {
        UserId: "user-456",
        UserName: "Bob Jones",
        NetBalanceAmount: 25,
      },
    ];

    expect(calculateSimplifiedDebts(balances)).toEqual([
      {
        fromUserId: "user-123",
        fromUserName: "Alice Smith",
        toUserId: "user-456",
        toUserName: "Bob Jones",
        amount: 25,
      },
    ]);
  });

  it("does not mutate the original balances array", () => {
    const balances: UserBalance[] = [
      {
        UserId: "alice",
        UserName: "Alice",
        NetBalanceAmount: -50,
      },
      {
        UserId: "bob",
        UserName: "Bob",
        NetBalanceAmount: 50,
      },
    ];

    const originalBalances = structuredClone(balances);

    calculateSimplifiedDebts(balances);

    expect(balances).toEqual(originalBalances);
  });
});

