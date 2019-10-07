// State //

export type PlayerVolley = {
  onBoard: number;
  inHole: number;
};

export type Volley = {
  throwingSide: 'side1' | 'side2';
  playerA: PlayerVolley;
  playerB: PlayerVolley;
};

export type ScoreState = {
  volleys: Volley[];
  ephemeralVolley?: Volley;
};

// Action types //

export const UPDATE_VOLLEY = 'UPDATE_VOLLEY';
export const COMMIT_VOLLEY = 'COMMIT_VOLLEY';

// Actions //

interface UpdateVolleyAction {
  type: typeof UPDATE_VOLLEY;
  volley: Volley;
}

interface CommitVolleyAction {
  type: typeof COMMIT_VOLLEY;
}

export type ScoreAction = UpdateVolleyAction | CommitVolleyAction;

// Action creators //

export function updateVolley(volley: Volley): ScoreAction {
  return {
    type: UPDATE_VOLLEY,
    volley,
  };
}

export function commitVolley(): ScoreAction {
  return {
    type: COMMIT_VOLLEY,
  };
}

// Initial state //

export const initialScoreState: ScoreState = {
  volleys: [],
};

// Reducer //

export function scoreReducer(
  state: ScoreState,
  action: ScoreAction,
): ScoreState {
  switch (action.type) {
    case UPDATE_VOLLEY:
      return {
        ...state,
        ephemeralVolley: action.volley,
      };
    case COMMIT_VOLLEY:
      if (state.ephemeralVolley) {
        return {
          volleys: state.volleys.concat(state.ephemeralVolley),
          ephemeralVolley: undefined,
        };
      }
    default:
      return state;
  }
}

// Derived state //
