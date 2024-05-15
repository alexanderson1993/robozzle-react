export interface Level {
  AllowedCommands: number,
  Colors: string[],
  Id: number,
  Items: string[],
  RobotRow: number,
  RobotCol: number,
  RobotDir: number,
  SubLengths: number[],
  Title: string,
  // Optionals
  CommentCount?: number,
  DifficultyVoteCount?: number,
  DifficultyVoteSum?: number,
  Solutions: number,
  Liked?: number,
  Disliked?: number,
  Featured?: boolean,
  SubmittedBy: any,
  SubmittedDate: string,
  About?: string,
}


export interface StackElement {
  command: number,
  color: string,
}


export interface DragPosition {
  x: number,
  y: number,
}


export interface DragInfo {
  position: DragPosition,
  command: string,
  color: string,
}
