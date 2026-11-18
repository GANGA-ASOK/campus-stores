# Campus Stores

> **Reviewers:** my submission is in the [next section](#my-submission-the-record-follows-the-item-through-the-handover). The prototype is in `app.js`, `styles.css` and `index.html`. Open `index.html` in a browser to try it.

## My submission: the record follows the item through the handover

**My decision:** I'd keep the product. The issue desk is solid. The part I'd change is what happens after a **partial return**. When the adapter stayed out overnight with someone other than the borrower, the register couldn't say who had it, when it was due back, or that it was overdue. The morning shift had to piece that together from a free-text note. I prototyped a change so the loan record tracks **who holds each unit and when it's expected back**, and so the morning shift can **start a return from the item in hand**.

### Try it in two minutes
1. Open `index.html` and click **Restart sample shift** at the bottom right.
2. **Requests** → *Courtyard screening* → **View kit** → **Issue kit** → choose Kabir Sen → **Save issue slips**.
3. **Move to return time** → **Record return** → tick PR-04 and SP-02. For AD-12, set "now with" to Leela Das and "Expected back" to Sat 9 am. Set Returned by to Kabir Sen → **Save return**.
4. **Move to next morning** → **Loan register** → type `AD` in **Unit on the counter** and choose AD-12 → **Save return**.

### A moment the product handles well: the Friday pickup
When I issued the Film Society kit, the issue form only offered units I could actually lend. PR-06, which is in the workshop, never appeared. The form refused equipment outside the approved request and refused a second unit of a type already on loan. It also recorded each physical unit, so AD-12 and AD-15 are separate records even though both are USB-C adapters in bin C4. At the counter it was hard to give Kabir the wrong kit.

### A moment I would change: the partial return and the morning handover
At 7:30 pm Kabir returned the projector and speaker and told me Leela had the adapter and would bring it at 9 am. The register had nowhere to record that. The adapter's slip still said **Kabir Sen · Due Fri 8 pm**, and my only option was a free-text desk-book note with no link to the slip.

At 9 am the incoming shift saw `L-404 · AD-12 · RQ-214 · Kabir Sen · Due Fri 8 pm` with:
- **no sign that it was overdue,** even though it was due the night before,
- **no item type or model,** so they had to cross-check Inventory to learn AD-12 is the Belkin adapter, not the Anker one in the same bin,
- **no mention of Leela,** the person now standing at the counter.

Then **Record return** closed the slip in one click. There was no step to confirm the unit, no record of who returned it or when, and no undo.

### The change
- **Requests become a kit view.** Each approved item shows its unit, slip, current holder and status: *Not issued*, *Out*, *Overdue* or *Returned*. The request list summarises each kit, for example "1 of 3 out, 2 back · 1 overdue".
- **Issue kit.** One form issues every approved item. The units on the shelf and the request's return time are filled in, so staff only choose who is collecting.
- **Record return is a short form.** You tick each unit that is on the counter, with its ID, model and bin shown so you can check the label, and name who returned it. For anything not ticked, you record **who has it now** and **when it's expected**. The slip's holder updates, the change goes into the slip's history, and a dated entry appears in the desk book automatically.
- **Overdue status.** The app compares desk time with due times. The register lists overdue slips first and shows type, model, holder and an expandable history on every row.
- **Start the return from the unit in hand.** A **Unit on the counter** box at the top of the register takes the ID printed on the label (`ad12`, `AD 12` and `AD-12` all work). Typing a prefix such as `AD` suggests every matching unit with its model and status, for example "on loan to Leela Das · overdue" or "on shelf in C4". Choosing one opens its slip, showing who should have it and since when, with the return already filled in. If the unit isn't on loan, the app says so and points to the open slip for that type of equipment.
- **Safety nets.** Undo after a return. Shifts saved by the earlier version are converted rather than thrown away.

### The same job, using the change
1. **Fri 3:45 pm, pickup.** Requests → *Courtyard screening* → **Issue kit**. PR-04, SP-02 and AD-12 are already selected and the return time is Fri 8 pm. I choose Kabir Sen and save, which creates three slips.
2. **Fri 7:30 pm, partial return.** **Record return**: I tick PR-04 and SP-02, returned by Kabir. For AD-12 I record "now with Leela Das, expected Sat 9 am". The kit shows "1 of 3 out, 2 back", and AD-12 is flagged *Back after due*. The desk book gets a dated entry: *"AD-12 (USB-C → HDMI adapter, Belkin AVC002) is with Leela Das, not Kabir Sen. Expected back Sat 9 am."* I don't need to write a note.
3. **Sat 9:00 am, handover.** The register opens with **L-404 · AD-12 · Belkin AVC002 · With Leela Das · expected Sat 9 am · Overdue** at the top. Leela hands over an adapter. I type `AD`, check the label, and choose AD-12. The slip opens ("with Leela Das since Friday 7:30 pm · due Fri 8 pm · Overdue") with *Returned by* already set to Leela. One click on Save closes it, and the kit reads "All returned". If her adapter had been AD-15, the lookup would have warned that AD-15 was never lent and that the open slip is for AD-12.

### What I kept
- The strict checks when issuing: approved items only, no units in repair, one of each approved type.
- One slip per physical unit.
- The desk book for messages between people. It now also receives custody changes automatically.

### What I'd watch for at a real counter
When the person holding a missing item walks in, can the incoming staff member **close the right slip without asking a colleague or searching the notes**? I'd time how long it takes from "they're at the counter" to "slip closed", and check whether the unit ID on the returned item's label matches the slip that was closed.

The slip history already records whether each return was **matched by unit ID** or started from the slip. That shows whether staff work from the item or from the register. One risk to watch: the suggestion list makes picking easy, so staff might choose a unit without reading the label. If returns get closed against the wrong unit, I'd remove the suggestions or require typing the full ID.

## Run the app

Open `index.html` in a modern browser. The app includes its scripts, styles, and icons and can run offline.

To serve it over local HTTP, run this from the repository folder and visit `http://localhost:8000`.

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Each browser stores its own sample shift locally when browser storage is available. **Restart sample shift** restores the fictional starting records.

## Source

- `index.html` contains the desk layout, candidate brief, and bundled icons.
- `app.js` contains the sample records and interactions, including the kit view, return form, custody history and unit lookup.
- `styles.css` defines the desktop and mobile layouts.

Icon license notices are in [third-party/lucide-LICENSE.txt](third-party/lucide-LICENSE.txt).

## About this exercise

Campus Stores is a Product Engineer work sample set at a fictional campus media equipment desk. Work through a club’s screening, from equipment pickup to a partial return and the next morning’s handover. Open **Candidate brief** in the app for the assignment.

### Submit your work

1. [Fork Campus Stores](https://github.com/virinchi-healthcare/campus-stores/fork) into your GitHub account. Complete the candidate brief and push your changes to your public fork. In your README, point reviewers to your work and explain the decision you made.
2. In your fork, open **Commits**, select the final commit you want reviewed, and copy the page URL. It should look like `https://github.com/YOUR-USERNAME/campus-stores/commit/COMMIT-SHA`.
3. [Submit your work through the Google Form](https://docs.google.com/forms/d/e/1FAIpQLScvzoh1R4WS-SkiwAVBQbMvniieJYSoOEfLMyVo5CyjOvYUgQ/viewform). Your **roll number**, **email ID**, and **final commit link from your public fork** are required. Enter your roll number and email ID in the form only.
