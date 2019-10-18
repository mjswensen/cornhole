// State //

export type Side = 'side1' | 'side2';
export type Team = 'teamA' | 'teamB';

export enum Color {
  RED = 'red',
  YELLOW = 'yellow',
  GREEN = 'green',
  TEAL = 'teal',
  BLUE = 'blue',
  GRAY = 'gray',
  BLACK = 'black',
  WHITE = 'white',
}

export type PlayerFrame = {
  onBoard: number;
  inHole: number;
};

export type Frame = {
  throwingSide: Side;
  teamA: PlayerFrame;
  teamB: PlayerFrame;
};

export type State = {
  names: {
    side1: {
      teamA: string;
      teamB: string;
    };
    side2: {
      teamA: string;
      teamB: string;
    };
  };
  colors: {
    teamA: Color;
    teamB: Color;
  };
  frames: Frame[];
  ephemeralFrame: Frame | null;
};

// Action types //

export const SET_PLAYER_NAME = 'SET_PLAYER_NAME';
export const SET_TEAM_COLOR = 'SET_TEAM_COLOR';
export const BEGIN_FRAME = 'BEGIN_FRAME';
export const UPDATE_FRAME = 'UPDATE_FRAME';
export const COMMIT_FRAME = 'COMMIT_FRAME';
export const CANCEL_FRAME = 'CANCEL_FRAME';

// Actions //

interface SetPlayerNameAction {
  type: typeof SET_PLAYER_NAME;
  side: Side;
  team: Team;
  name: string;
}

interface SetTeamColorAction {
  type: typeof SET_TEAM_COLOR;
  team: Team;
  color: Color;
}

interface BeginFrameAction {
  type: typeof BEGIN_FRAME;
  side: Side;
}

interface UpdateFrameAction {
  type: typeof UPDATE_FRAME;
  frame: Frame;
}

interface CommitFrameAction {
  type: typeof COMMIT_FRAME;
}

interface CancelFrameAction {
  type: typeof CANCEL_FRAME;
}

export type Action =
  | SetPlayerNameAction
  | SetTeamColorAction
  | BeginFrameAction
  | UpdateFrameAction
  | CommitFrameAction
  | CancelFrameAction;

// Action creators //

export function setPlayerName(side: Side, team: Team, name: string): Action {
  return {
    type: SET_PLAYER_NAME,
    side,
    team,
    name,
  };
}

export function setTeamColor(team: Team, color: Color): Action {
  return {
    type: SET_TEAM_COLOR,
    team,
    color,
  };
}

export function beginFrame(side: Side): Action {
  return {
    type: BEGIN_FRAME,
    side,
  };
}

export function updateFrame(frame: Frame): Action {
  return {
    type: UPDATE_FRAME,
    frame,
  };
}

export function commitFrame(): Action {
  return {
    type: COMMIT_FRAME,
  };
}

export function cancelFrame(): Action {
  return {
    type: CANCEL_FRAME,
  };
}

// Initial state //

export const initialState: State = {
  names: {
    side1: {
      teamA: '',
      teamB: '',
    },
    side2: {
      teamA: '',
      teamB: '',
    },
  },
  colors: {
    teamA: Color.BLUE,
    teamB: Color.GRAY,
  },
  frames: [],
  ephemeralFrame: null,
};

// Reducer //

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case SET_PLAYER_NAME:
      return {
        ...state,
        names: {
          ...state.names,
          [action.side]: {
            ...state.names[action.side],
            [action.team]: action.name,
          },
        },
      };
    case SET_TEAM_COLOR:
      return {
        ...state,
        colors: {
          ...state.colors,
          [action.team]: action.color,
        },
      };
    case BEGIN_FRAME:
      return {
        ...state,
        ephemeralFrame: {
          throwingSide: action.side,
          teamA: {
            onBoard: 0,
            inHole: 0,
          },
          teamB: {
            onBoard: 0,
            inHole: 0,
          },
        },
      };
    case UPDATE_FRAME:
      return {
        ...state,
        ephemeralFrame: action.frame,
      };
    case COMMIT_FRAME:
      if (state.ephemeralFrame !== null) {
        return {
          ...state,
          frames: state.frames.concat(state.ephemeralFrame),
          ephemeralFrame: null,
        };
      } else {
        return state;
      }
    case CANCEL_FRAME:
      return {
        ...state,
        ephemeralFrame: null,
      };
    default:
      return state;
  }
}

// Derived state //

export type Score = {
  teamA: number;
  teamB: number;
};

function toPoints(frame: PlayerFrame): number {
  return frame.inHole * 3 + frame.onBoard;
}

function last<T>(arr: T[]): T {
  return arr[arr.length - 1];
}

function latestScore(annotatedFrames: AnnotatedFrame[]): Score {
  return last(annotatedFrames)
    ? last(annotatedFrames).score
    : { teamA: 0, teamB: 0 };
}

export function currentScore(state: State): Score {
  return latestScore(annotatedFrames(state.frames));
}

export function winner(state: State): Team | null {
  const score = currentScore(state);
  if (score.teamA === 21) {
    return 'teamA';
  } else if (score.teamB === 21) {
    return 'teamB';
  } else {
    return null;
  }
}

export type AnnotatedFrame = Frame & {
  diffA: number;
  diffB: number;
  bust: Team | null;
  score: Score;
};

export function annotatedFrames(frames: Frame[]): AnnotatedFrame[] {
  return frames.reduce<AnnotatedFrame[]>((annotatedFrames, frame) => {
    const score = latestScore(annotatedFrames);
    const diffA = Math.max(0, toPoints(frame.teamA) - toPoints(frame.teamB));
    const diffB = Math.max(0, toPoints(frame.teamB) - toPoints(frame.teamA));
    const newScoreA = score.teamA + diffA;
    const newScoreB = score.teamB + diffB;
    const bust = newScoreA > 21 ? 'teamA' : newScoreB > 21 ? 'teamB' : null;
    const newScore = {
      teamA: newScoreA > 21 ? 11 : newScoreA,
      teamB: newScoreB > 21 ? 11 : newScoreB,
    };
    return annotatedFrames.concat({
      ...frame,
      diffA,
      diffB,
      bust,
      score: newScore,
    });
  }, []);
}

export function annotatedEphemeralFrame(state: State): AnnotatedFrame | null {
  if (state.ephemeralFrame) {
    return last(annotatedFrames([...state.frames, state.ephemeralFrame]));
  } else {
    return null;
  }
}
