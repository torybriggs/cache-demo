import { LoaderFunctionArgs, redirect } from "@remix-run/cloudflare";
import { Form, json, useLoaderData } from "@remix-run/react";

export async function action({ request }) {
  const body = new URLSearchParams(await request.text());
  const answer = body.get("answer");

  if (!answer) {
    return new Response("Answer is required", {
      status: 400,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
  return redirect(`/questions/${answer}`);
}

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const { env } = context.cloudflare;
  const step = parseInt(params.step) + 1;
  const dateFromCache = await env.demo_cache.get("date");
  if (dateFromCache) {
    return json({ step, date: dateFromCache });
  }
  const dateRequest = await fetch(
    "https://cache-demo.pages.dev/questions/date"
  );
  const { date } = await dateRequest.json();
  return json({ step, date });
};

export default function QuestionStep() {
  let data = useLoaderData();

  return (
    <div>
      <p>
        <b>Data to cache</b>: {data.date}
      </p>
      <Form method="post">
        <fieldset>
          <legend>What is the answer?</legend>
          <input type="radio" name="answer" id="continue" value={data.step} />
          <label htmlFor="yes">Continue to {data.step}</label>
          <br />
          <button type="submit">Submit</button>
        </fieldset>
      </Form>
    </div>
  );
}
