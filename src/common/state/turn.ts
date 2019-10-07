// State //

export enum SideStatus {
  THROWING,
  WAITING,
  RECORDING,
}

export type TurnState = {
  side1: SideStatus;
  side2: SideStatus;
};

// Action types //

export const REQUEST_RECORD = 'REQUEST_RECORD';

// Actions //

interface RequestRecordAction {
  type: typeof REQUEST_RECORD;
  side: keyof TurnState;
}

export type TurnAction = RequestRecordAction;

// Action creators //

export function requestRecord(side: keyof TurnState): TurnAction {
  return {
    type: REQUEST_RECORD,
    side,
  };
}

// Initial state //

export const initialTurnState: TurnState = {
  side1: SideStatus.WAITING,
  side2: SideStatus.WAITING,
};

// Reducer //

export function turnReducer(state: TurnState, action: TurnAction): TurnState {
  switch (action.type) {
    case REQUEST_RECORD:
      switch (action.side) {
        case 'side1':
          return {
            side1: SideStatus.RECORDING,
            side2: SideStatus.THROWING,
          };
        case 'side2':
          return {
            side1: SideStatus.THROWING,
            side2: SideStatus.RECORDING,
          };
        default:
          return state;
      }
    default:
      return state;
  }
}

// Derived state //

export type SideTurnState = {
  status: SideStatus;
};

export function sideTurnState(
  state: TurnState,
  side: keyof TurnState,
): SideTurnState {
  return {
    status: state[side],
  };
}
