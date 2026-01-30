export class GameState {
  constructor() {
    this.state = 'playing';
  }

  reset() {
    this.state = 'playing';
  }

  win() {
    this.state = 'won';
  }

  lose() {
    this.state = 'lost';
  }

  isPlaying() {
    return this.state === 'playing';
  }

  isWon() {
    return this.state === 'won';
  }

  isLost() {
    return this.state === 'lost';
  }

  renderOverlay(ctx, canvasWidth, canvasHeight) {
    if (!this.isWon() && !this.isLost()) {
      return;
    }

    // Draw semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Set up text styling
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Determine message based on state
    const mainMessage = this.isWon() ? 'Level Complete!' : 'Game Over!';
    const subMessage = 'Press R to restart';

    // Draw main message
    ctx.fillText(mainMessage, canvasWidth / 2, canvasHeight / 2 - 40);

    // Draw sub message with smaller font
    ctx.font = '24px Arial';
    ctx.fillText(subMessage, canvasWidth / 2, canvasHeight / 2 + 40);
  }
}
