import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";

describe("NewsletterForm", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        message: "You're subscribed!",
      }),
    } as Response);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("submits via form button click", async () => {
    const user = userEvent.setup();

    render(<NewsletterForm source="footer" buttonLabel="Subscribe" />);

    await user.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
    await user.click(screen.getByRole("button", { name: "Subscribe" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/subscribe",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });
  });
});
