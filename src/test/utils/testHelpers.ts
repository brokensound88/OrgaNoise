import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

export async function waitForLoadingToFinish() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

export function createMockComponent(displayName: string) {
  const component = vi.fn(() => null);
  component.displayName = displayName;
  return component;
}

export async function typeIntoInput(input: HTMLElement, text: string) {
  const user = userEvent.setup();
  await user.type(input, text);
}

export async function selectOption(select: HTMLElement, optionText: string) {
  const user = userEvent.setup();
  await user.selectOptions(select, optionText);
}

export function mockConsoleError() {
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  
  afterAll(() => {
    console.error = originalError;
  });
}

export function mockDate(date: string | number | Date) {
  const RealDate = Date;
  beforeAll(() => {
    global.Date = class extends RealDate {
      constructor() {
        super();
        return new RealDate(date);
      }
    } as DateConstructor;
  });
  
  afterAll(() => {
    global.Date = RealDate;
  });
}