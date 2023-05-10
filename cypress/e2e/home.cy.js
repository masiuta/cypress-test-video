describe('Cine books player', () => {
  const normalizeText = (s) => s.replace(/^\s+|\s+$|\n/gm, '');
  const titleText = 'What is a cine-book?';
  const firstSubtitle = 'True!';
  const defaultTime = 5000;
  const timeWaitForSubtitle = 15000;
  const videoSlider = '.slider-wrapper > .rc-slider > .rc-slider-track';

  function checkVideoGreaterThanPercentage(elementSelector, percentage) {
    return cy
      .get(elementSelector)
      .should('have.attr', 'style')
      .and('include', 'width:')
      .then((styleAttribute) => {
        const widthMatch = styleAttribute.match(/width: (\d+(?:\.\d+)?)%/);
        const width = widthMatch ? parseFloat(widthMatch[1]) : null;
        expect(width).to.be.greaterThan(percentage);
        return width;
      });
  }

  function checkVideoLessThanPercentage(elementSelector, percentage) {
    return cy
      .get(elementSelector)
      .should('have.attr', 'style')
      .and('include', 'width:')
      .then((styleAttribute) => {
        const widthMatch = styleAttribute.match(/width: (\d+(?:\.\d+)?)%/);
        const width = widthMatch ? parseFloat(widthMatch[1]) : null;
        expect(width).to.be.lessThan(percentage);
        return width;
      });
  }

  function checkPlayVideo() {
    cy.visit('https://cine-books.com');
    cy.get('.page-format__video-info')
      .find('.title')
      .should(($title) => {
        const title = normalizeText($title.text());
        expect(title).to.equal(titleText);
      });

    cy.get('.play-block-center').click().wait(defaultTime);

    checkVideoGreaterThanPercentage(videoSlider, 0.15);
  }

  function checkStopVideo() {
    cy.get('.play-block-center').click().wait(defaultTime);

    checkVideoLessThanPercentage(videoSlider, 2.4);
  }

  it('plays video and find first subtitle', () => {
    checkPlayVideo();

    cy.wait(timeWaitForSubtitle);
    cy.get('.video-player-wrapper')
      .find('.video_subtitles.active', { timeout: timeWaitForSubtitle })
      .should(($value) => {
        const idText = normalizeText($value.text());
        expect(idText).to.equal(firstSubtitle);
      });

    checkStopVideo();
  });
});
