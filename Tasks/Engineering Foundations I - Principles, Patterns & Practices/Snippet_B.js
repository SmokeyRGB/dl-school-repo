async function getTicketSummary(ticketId) {
  const ticket = await db.tickets.findById(ticketId);

  const prompt =
    "Summarize this ticket:\n\n" +
    ticket.message +
    "\nCustomer tier: " +
    ticket.customerTier;

  const summary = await ai.generateText(prompt);

  await db.summaries.insert({
    ticketId,
    summary,
    createdAt: new Date()
  });

  await slack.postMessage("#support", summary);

  return summary;
}
