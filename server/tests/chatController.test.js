const ChatController = require("../src/controllers/chatController")
const service = require("../src/services/messages.service")

jest.mock("../src/services/messages.service")

describe("ChatController", () => {
	let chatController

	beforeEach(() => {
		chatController = new ChatController()
	})

	describe("index", () => {
		it("should return all messages", async () => {
			const messages = [
				{
					username: "user0",
					message: "hello from the day before yesterday",
					createdAt: new Date().setDate(new Date().getDate() - 2),
				},
				{
					username: "user1",
					message: "hello from yesterday",
					createdAt: new Date().setDate(new Date().getDate() - 1),
				},
				{
					username: "user2",
					message: "hi from now",
					createdAt: new Date(),
				},
			]

			const expectedGroupedResponse = [
				{
					// Calculates the date for the first message in format "23 May 2021" in en-US locale
					date: new Intl.DateTimeFormat("en-US", {
						year: "numeric",
						month: "long",
						day: "numeric",
					}).format(messages[0].createdAt),
					messages: [
						{
							username: messages[0].username,
							message: messages[0].message,
							createdAt: messages[0].createdAt,
						},
					],
				},
				{
					date: "Yesterday",
					messages: [
						{
							username: messages[1].username,
							message: messages[1].message,
							createdAt: messages[1].createdAt,
						},
					],
				},
				{
					date: "Today",
					messages: [
						{
							username: messages[2].username,
							message: messages[2].message,
							createdAt: messages[2].createdAt,
						},
					],
				},
			]

			service.getMessages.mockResolvedValue(messages)

			const req = {}
			const res = {
				status: jest.fn().mockReturnThis(),
				json: jest.fn(),
			}
			const next = jest.fn()

			await chatController.index(req, res, next)

			expect(service.getMessages).toHaveBeenCalled()
			expect(res.status).toHaveBeenCalledWith(200)
			expect(res.json).toHaveBeenCalledWith(expectedGroupedResponse)
			expect(next).not.toHaveBeenCalled()
		})
	})
})
