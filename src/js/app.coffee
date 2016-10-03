$(document).ready ->
  if !cards
    cards = [
      {
        type: 'narrow'
      },
      {
        type: 'wide'
      }, 
      {
        type: 'wide'
      },
    ]

  cardsContainer = $('#cardsContainer')
  cardsTemplateSource = $('#cardsTemplate').html()
  cardsTemplate = Handlebars.compile(cardsTemplateSource)
  cardsContainer.append(cardsTemplate(cards))

  history.replaceState(cards, 'cards', '/')  

  updateTemplate = (container, source, data) ->
    if !container || !source || !data
      return
    container.empty()
    compiledTemplate = Handlebars.compile(source)
    container.append(compiledTemplate(data))
  
  @clickOnCard = (event, index) ->
    switch
      when event.shiftKey && event.altKey then cards.push({type: 'wide'})
      when event.shiftKey then cards.push({type: 'narrow'})
      else (
        if index == 0
          return
        cards.pop()
      ) 
    history.pushState(cards, 'cards', '/')
    updateTemplate(cardsContainer, cardsTemplateSource, cards)

  window.onpopstate = (event) =>
    cards = event.state
    history.replaceState(cards, 'cards', '/')
    updateTemplate(cardsContainer, cardsTemplateSource, cards)
