Handlebars.registerHelper('if_eq', (a, b, options) ->
  if a == b
    return options.fn(this)
  else
    return options.inverse(this)
)
Handlebars.registerHelper('inc', (value, options) ->
	return parseInt(value) + 1
)