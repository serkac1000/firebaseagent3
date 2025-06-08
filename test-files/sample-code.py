
# Sample Python Code for GitHub Testing
# This file demonstrates basic Python functionality

def fibonacci(n):
    """Calculate the nth Fibonacci number"""
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci(n-1) + fibonacci(n-2)

def factorial(n):
    """Calculate factorial of n"""
    if n <= 1:
        return 1
    return n * factorial(n-1)

class Calculator:
    """Simple calculator class"""
    
    def __init__(self):
        self.history = []
    
    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result
    
    def multiply(self, a, b):
        result = a * b
        self.history.append(f"{a} * {b} = {result}")
        return result
    
    def get_history(self):
        return self.history

if __name__ == "__main__":
    print("Testing Fibonacci:")
    for i in range(10):
        print(f"fib({i}) = {fibonacci(i)}")
    
    print("\nTesting Calculator:")
    calc = Calculator()
    print(calc.add(5, 3))
    print(calc.multiply(4, 7))
    print("History:", calc.get_history())
