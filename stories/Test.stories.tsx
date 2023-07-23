import type { Meta, StoryObj } from '@storybook/react';
import { VizupVisualization } from '../src'


const meta: Meta<typeof VizupVisualization> = {
  component: VizupVisualization,
};

export default meta;
type Story = StoryObj<typeof VizupVisualization>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <VizupVisualization width={800} height={600} />,
};