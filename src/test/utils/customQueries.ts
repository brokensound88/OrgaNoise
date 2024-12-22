import { queryHelpers, buildQueries } from '@testing-library/react';

// Custom query to find elements by data-testid with partial match
const queryAllByTestIdPartial = (
  container: HTMLElement,
  id: string,
  options?: { exact?: boolean }
) =>
  queryHelpers.queryAllByAttribute(
    'data-testid',
    container,
    (testId: string) => testId.includes(id),
    options
  );

const getMultipleError = (id: string) =>
  `Found multiple elements with data-testid including "${id}"`;
const getMissingError = (id: string) =>
  `Unable to find an element with data-testid including "${id}"`;

const [
  queryByTestIdPartial,
  getAllByTestIdPartial,
  getByTestIdPartial,
  findAllByTestIdPartial,
  findByTestIdPartial,
] = buildQueries(queryAllByTestIdPartial, getMultipleError, getMissingError);

export {
  queryByTestIdPartial,
  queryAllByTestIdPartial,
  getByTestIdPartial,
  getAllByTestIdPartial,
  findByTestIdPartial,
  findAllByTestIdPartial,
};