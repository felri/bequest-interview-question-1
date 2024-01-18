import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import { App } from "./App";
import fetchMock from "jest-fetch-mock";
const { expect, beforeEach, test, afterEach } = require("@jest/globals");

fetchMock.enableMocks();

const mockData = {
  data: "test data",
  signature: "test signature",
  version: 1,
};

const updatedData = {
  data: "updated data",
  signature: "updated signature",
  version: 2,
};

const mockPublicKey = {
  publicKey: "test public key",
};

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(() => {
  fetchMock.resetMocks();
});

test("fetches and displays data", async () => {
  fetchMock
    .mockResponseOnce(JSON.stringify({ ...mockPublicKey }))
    .mockResponseOnce(JSON.stringify({ ...mockData }));

  render(<App />);

  const dataElement = await screen.findByDisplayValue("test data");

  expect(dataElement).toBeInTheDocument();
});

test("fetches and sets public key on initial load", async () => {
  fetchMock
    .mockResponseOnce(JSON.stringify({ ...mockPublicKey }))
    .mockResponseOnce(JSON.stringify({ ...mockData }));

  render(<App />);

  const publicKeyElement = await screen.findByDisplayValue("test public key");
  expect(publicKeyElement).toBeInTheDocument();
});

test("handles data update", async () => {
  fetchMock
    .mockResponseOnce(JSON.stringify(mockPublicKey))
    .mockResponseOnce(JSON.stringify(mockData))
    .mockResponseOnce(JSON.stringify({}))
    .mockResponseOnce(JSON.stringify(updatedData));

  render(<App />);

  const dataInput = await screen.findByDisplayValue("test data");
  fireEvent.change(dataInput, { target: { value: "updated data" } });

  const updateButton = screen.getByText("Update Data");
  fireEvent.click(updateButton);

  const updatedDataElement = await screen.findByDisplayValue("updated data");
  expect(updatedDataElement).toBeInTheDocument();
});

test("handles data verification", async () => {
  fetchMock
    .mockResponseOnce(JSON.stringify(mockPublicKey))
    .mockResponseOnce(JSON.stringify(mockData))
    .mockResponseOnce(JSON.stringify({}))
    .mockResponseOnce(JSON.stringify(updatedData));

  render(<App />);

  const dataInput = await screen.findByDisplayValue("test data");
  fireEvent.change(dataInput, { target: { value: "updated data" } });

  const updateButton = screen.getByText("Update Data");
  fireEvent.click(updateButton);

  const updatedDataElement = await screen.findByDisplayValue("updated data");
  expect(updatedDataElement).toBeInTheDocument();

  const verifyButton = screen.getByText("Verify Data");
  fireEvent.click(verifyButton);

  expect(screen.queryByText("Data has been tampered with")).toBeNull();
});

test("handles data tampering", async () => {
  fetchMock
    .mockResponseOnce(JSON.stringify(mockPublicKey))
    .mockResponseOnce(JSON.stringify(mockData))
    .mockResponseOnce(JSON.stringify({}))
    .mockResponseOnce(JSON.stringify(updatedData));

  render(<App />);

  const dataInput = await screen.findByDisplayValue("test data");
  fireEvent.change(dataInput, { target: { value: "updated data" } });

  const updateButton = screen.getByText("Update Data");
  fireEvent.click(updateButton);

  const updatedDataElement = await screen.findByDisplayValue("updated data");
  expect(updatedDataElement).toBeInTheDocument();

  const publicKeyInput = await screen.findByDisplayValue("test public key");
  fireEvent.change(publicKeyInput, {
    target: { value: "updated public key" },
  });

  const verifyButton = screen.getByText("Verify Data");
  fireEvent.click(verifyButton);

  const tamperedElement = await screen.findByText(
    "Data has been tampered with"
  );
  expect(tamperedElement).toBeInTheDocument();
});
