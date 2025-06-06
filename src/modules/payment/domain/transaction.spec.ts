import Transaction from "./transaction";

describe("Transaction Entity unit test", () => {

  it("should throw an error if amount is less than or equal to zero", () => {
    expect(() => {
      new Transaction({
        amount: 0,
        orderId: "order-1",
      });
    }).toThrowError("Amount must be greater than 0");

    expect(() => {
      new Transaction({
        amount: -10,
        orderId: "order-2",
      });
    }).toThrowError("Amount must be greater than 0");
  });

  it("should create transaction successfully if amount is valid", () => {
    const transaction = new Transaction({
      amount: 200,
      orderId: "order-3",
    });

    expect(transaction.amount).toBe(200);
    expect(transaction.orderId).toBe("order-3");
    expect(transaction.status).toBe("pending");
  });

  it("should approve transaction if amount >= 100", () => {
    const transaction = new Transaction({
      amount: 150,
      orderId: "order-4",
    });

    transaction.process();

    expect(transaction.status).toBe("approved");
  });

  it("should decline transaction if amount < 100", () => {
    const transaction = new Transaction({
      amount: 99,
      orderId: "order-5",
    });

    transaction.process();

    expect(transaction.status).toBe("declined");
  });

  it("should set status to approved when approve() is called", () => {
    const transaction = new Transaction({
      amount: 200,
      orderId: "order-6",
    });

    transaction.approve();

    expect(transaction.status).toBe("approved");
  });

  it("should set status to declined when decline() is called", () => {
    const transaction = new Transaction({
      amount: 200,
      orderId: "order-8",
    });

    transaction.decline();

    expect(transaction.status).toBe("declined");
  });
});
