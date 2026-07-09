import type { Meta, StoryObj } from "@storybook/react";
import { Board, BoardProvider } from "./index";

const meta = { title: "Host/Board", component: Board } satisfies Meta<typeof Board>;
export default meta;

export const Empty: StoryObj<typeof Board> = {
  render: () => (
    <BoardProvider>
      <Board />
    </BoardProvider>
  ),
};
