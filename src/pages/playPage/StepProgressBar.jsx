import React from "react";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

export class StepProgressBar extends React.Component {
  render() {
    return (
      <ProgressBar
        filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
        percent={75}
      >
        <Step transition="scale">
          {({ accomplished, index }) => (
            <div
              className={`transitionStep ${
                accomplished ? "accomplished" : null
              }`}
            >
              🌑
            </div>
          )}
        </Step>
        <Step transition="scale">
          {({ accomplished, index }) => (
            <div
              className={`transitionStep ${
                accomplished ? "accomplished" : null
              }`}
            >
              🌒
            </div>
          )}
        </Step>
        <Step transition="scale">
          {({ accomplished, index }) => (
            <div
              className={`transitionStep ${
                accomplished ? "accomplished" : null
              }`}
            >
              🌓
            </div>
          )}
        </Step>
        <Step transition="scale">
          {({ accomplished, index }) => (
            <div
              className={`transitionStep ${
                accomplished ? "accomplished" : null
              }`}
            >
              🌔
            </div>
          )}
        </Step>
        <Step transition="scale">
          {({ accomplished, index }) => (
            <div
              className={`transitionStep ${
                accomplished ? "accomplished" : null
              }`}
            >
              🌕
            </div>
          )}
        </Step>
      </ProgressBar>
    );
  }
}
