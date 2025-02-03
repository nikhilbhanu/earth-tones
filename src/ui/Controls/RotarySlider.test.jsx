/**
 * @vitest-environment jsdom
 */
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from 'react';
import RotarySlider from './RotarySlider';

afterEach(() => {
    cleanup();
});

beforeEach(() => {
    // Mock getBoundingClientRect for all elements
    const mockGetBoundingClientRect = vi.fn(() => ({
        width: 40,
        height: 40,
        top: 0,
        left: 0,
        bottom: 40,
        right: 40,
        x: 0,
        y: 0
    }));
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;
});

test('RotarySlider responds to vertical drag movement', () => {
    const onChange = vi.fn();
    render(<RotarySlider label="Test Slider" value={0} onChange={onChange} />);
    const slider = screen.getByTestId('knob');

    // Simulate drag sequence
    fireEvent.mouseDown(slider, { clientY: 100 });
    fireEvent.mouseMove(document, { clientY: 80 }); // Moving up 20px
    fireEvent.mouseUp(document);

    expect(onChange).toHaveBeenCalled();
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1];
    expect(lastCall[1]).toBeGreaterThan(0); // Value should increase when moving up
});

test('RotarySlider responds to mouse wheel', () => {
    const onChange = vi.fn();
    render(<RotarySlider label="Test Slider" value={0} onChange={onChange} />);
    const slider = screen.getByTestId('knob');

    // Scroll up (negative deltaY) should increase value
    fireEvent.wheel(slider, { deltaY: -100 });
    expect(onChange).toHaveBeenCalledWith(null, 1);

    // Scroll down (positive deltaY) should decrease value
    fireEvent.wheel(slider, { deltaY: 100 });
    expect(onChange).toHaveBeenCalledWith(null, 0);
});

test('RotarySlider responds to keyboard navigation', () => {
    const onChange = vi.fn();
    render(<RotarySlider label="Test Slider" value={0} onChange={onChange} />);
    const slider = screen.getByTestId('knob');

    // Arrow keys
    fireEvent.keyDown(slider, { key: 'ArrowUp' });
    expect(onChange).toHaveBeenCalledWith(null, 1);

    fireEvent.keyDown(slider, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenCalledWith(null, 0);

    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(null, 1);

    fireEvent.keyDown(slider, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith(null, 0);

    // Home and End keys
    fireEvent.keyDown(slider, { key: 'Home' });
    expect(onChange).toHaveBeenCalledWith(null, -23);

    fireEvent.keyDown(slider, { key: 'End' });
    expect(onChange).toHaveBeenCalledWith(null, 23);
});

test('RotarySlider clamps values within valid range', () => {
    const onChange = vi.fn();
    render(<RotarySlider label="Test Slider" value={-22} onChange={onChange} />);
    const slider = screen.getByTestId('knob');

    // Try to exceed minimum value
    fireEvent.wheel(slider, { deltaY: 100 }); // Scroll down at near min
    expect(onChange).toHaveBeenCalledWith(null, -23);

    // Reset mock and try maximum
    onChange.mockReset();
    render(<RotarySlider label="Test Slider" value={22} onChange={onChange} />);
    fireEvent.wheel(slider, { deltaY: -100 }); // Scroll up at near max
    expect(onChange).toHaveBeenCalledWith(null, 23);
});

test('RotarySlider maintains state during drag sequences', () => {
    const onChange = vi.fn();
    render(<RotarySlider label="Test Slider" value={0} onChange={onChange} />);
    const slider = screen.getByTestId('knob');

    // First drag moving up
    fireEvent.mouseDown(slider, { clientY: 100 });
    fireEvent.mouseMove(document, { clientY: 80 }); // Move up 20px
    fireEvent.mouseUp(document);

    const firstCallIndex = onChange.mock.calls.length - 1;
    const firstValue = onChange.mock.calls[firstCallIndex][1];
    expect(firstValue).toBeGreaterThan(0);

    // Second drag moving down
    fireEvent.mouseDown(slider, { clientY: 80 });
    fireEvent.mouseMove(document, { clientY: 100 }); // Move down 20px
    fireEvent.mouseUp(document);

    const secondCallIndex = onChange.mock.calls.length - 1;
    const secondValue = onChange.mock.calls[secondCallIndex][1];
    expect(secondValue).toBeLessThan(firstValue);
});
