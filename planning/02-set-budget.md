# Feature Plan: [Set Budget on Transactions]

## Feature Overview

* **Objective:** Allow users to set a max budget to spend on current month and alert the user if they exceeds that max budget.

---

## Architecture & Data Flow

```mermaid
flowchart TD

    %% FRONTEND SUBGRAPH
    subgraph client [React Native Frontend]
        A([User Clicks Set a Budget from Dropdown or Settings]) --> B[Navigate to Set Budget Screen]
        B --> C[Screen with 2 fields, 1: max budget, 2: date month-year]
        C --> D[User clicks on Set This Budget Button]
        D --> E[Send HTTP POST Request]
    end

    
    %% THE NETWORK BRIDGE
    E -->|HTTP POST /api/transactions/set-budget| F{API Gateaway / Auth}

    
    %% BACKEND SUBGRAPH
    subgraph server [Backend System]
        F -- Unauthorized --> G([401 Error Request])
        F -- valid token --> H[Set Budget Controller]
        H --> I[Validate JSON Body]
        I --> J[store the max budget in Budgets Collection in Mongoose Database]
        J --> K[fetch the same budget from database as json object]
        K --> L[send that json object in success]
    end


    %% RESPONSE SYNC
    L --> M{Response Check}
    M -- Error --> N[Show Error Snackbar]
    M -- Success --> O[Show Success Snackbar]
    O --> P([store json body in local storage budgets table])
    P --> Q[show success snackbar and Navigate to Home Screen]
```


## Data Contract Specifications

### Frontend Specifications (React Native / Expo)

**States:**

- set the current month-year value to monthYear state in init of SetBudget Screen


```ts

const [maxBudget, setMaxBudget] = useState<number>(0);
const [monthYear, SetMonthYear] = useState<string>("");


export interface SetBudgetRequestPayload {
    maxBudget: number;
    monthYear: string;
};


export interface Budget {
    id: string;
    maxBudget: number;
    monthYear: string;
    totalSpent: number;
    createdAt: Date;
};

export interface BudgetDTO {
    id: string;
    maxBudget: string;
    monthYear: string;
    totalSpent: string;
    createdAt: string;
};
```

---

## Network Layer Specifications

**Endpoint:**
```
/api/set-budget
```

**Payload Structure:**
```json
{
    "maxBudget": 12000, // in base currency
    "monthYear": "09-2026"
}
```