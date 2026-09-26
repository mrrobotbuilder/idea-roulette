// Idea bank. One idea per line: "Title :: pitch". Kept as template blocks so
// quotes and apostrophes need no escaping. `npm run check` validates the format.

export type Category = {
  key: string;
  name: string;
  emoji: string;
  color: string;
  ideas: string[];
};

const lines = (block: string) =>
  block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export const CATEGORIES: Category[] = [
  {
    key: "money",
    name: "Money Maker",
    emoji: "💰",
    color: "#1f9d55",
    ideas: lines(`
Invoice Nagger :: Auto-escalating reminders for unpaid freelance invoices that go from sweet to icy over 30 days.
Menu Polyglot :: Restaurants snap their menu and get a QR code serving it in 20 languages with allergen tags.
Churn Whisperer :: Connect Stripe, flag customers who are about to cancel, and draft the win-back email for you.
60-Second Local SEO Audit :: Type a business name, get a one-page report of what is broken on its Google profile. Sell the fix.
Niche Job Board :: A job board for one tiny niche (remote marine biologists, Rust game devs) with paid listings.
Receipt Forwarder :: Forward receipts to an email address and get a tax-ready categorized spreadsheet in April.
Landlord Fix Queue :: Tenants report issues with photos; landlords get a triaged queue with contractor links.
Competitor Pricing Watch :: Track the pricing pages of competitors and get pinged the moment they change.
Podcast to Newsletter :: Each episode becomes a newsletter, show notes, and five social posts automatically.
Etsy Listing Doctor :: Paste an Etsy listing and get a rewritten title, 13 tags, and a photo checklist.
Dog Walker in a Link :: Link-in-bio booking, calendar, and payments for solo dog walkers.
Five-Dollar Status Page :: Dead-simple hosted status pages for indie makers. Charge five bucks a month.
Contract Red Flags :: Upload a freelance contract and the scary clauses get highlighted in plain English.
Class Waitlist Autopilot :: Auto-fills cancelled gym and yoga class spots from a waitlist over SMS.
Airbnb Guidebook Builder :: Hosts answer ten questions and get a beautiful digital house manual with local tips.
Testimonial Wall :: Collect video testimonials by link and embed a glowing wall on any site.
First-Line Personalizer :: Writes the opening line of a cold email from the prospect's public website.
Neighborhood Tutor Market :: A local marketplace for high-school tutors sorted by subject, grade and price.
Abandoned Cart Postcard :: Send a real paper postcard to Shopify shoppers who abandon their carts.
Rate Calculator Lead Magnet :: Tells freelancers their hourly rate from salary goals, taxes and vacation. Upsell a course.
Changelog as a Service :: Gorgeous hosted changelogs plus an in-app what-is-new widget.
Event Photo Finder :: Guests upload one selfie and get every event photo they appear in.
Listing Writer for Realtors :: Upload house photos, get a compelling listing and room-by-room summary.
No-Show Killer :: SMS reminders with one-tap reschedule for dentists, barbers and small clinics.
Paywall for Notion :: Sell access to any Notion page with Stripe in two clicks.
Car Wash Membership :: Recurring memberships with license-plate check-in for independent car washes.
Resume Roaster Pro :: A free, brutal resume roast. The rewrite costs nine dollars.
Metered Billing Kit :: Drop-in usage-based billing for tiny API businesses.
Farm Box Preorders :: A weekly preorder page for farms selling veggie boxes, with pickup slots.
Salon Rebook Nudge :: Texts clients when their usual haircut interval is up, with a booking link.
Grant Matcher :: Matches small nonprofits to grants they actually qualify for, with deadlines.
Vertical Extension Bundle :: A subscription bundle of browser extensions for one profession, like real estate agents.
Course Quiz Generator :: Upload a course video and get quizzes, flashcards and a certificate page.
Blog Post to Lead Magnet :: Turns any blog post into a downloadable checklist PDF behind an email capture.
Neighbor Gear Rental :: Rent your camera, drone or tent to neighbors, with deposits held by Stripe.
Handyman Photo Quote :: Customers photograph the job and get an instant price range and a booking link.
Inside Joke Merch :: A friend group uploads its inside jokes and gets a print-on-demand merch store.
Newsletter Ad Slots :: A marketplace where small newsletters list sponsor slots and brands book them.
Meeting Cost Meter :: A calendar add-on that shows the dollar cost of every meeting. Managers will pay.
Creator Money Dashboard :: YouTube, Patreon and sponsor income in one place, with tax estimates.
AI Receptionist for Plumbers :: Answers the phone, qualifies the job and books it into the calendar.
Chat to Invoice :: Screenshot the chat where a client agreed to a price and get a ready invoice.
Cafe Menu Boards :: Turn any TV into a cafe menu board controlled from your phone.
Indie Game Presskit :: Generates a press kit page plus a list of journalists who cover your genre.
README Tip Jar :: One-click sponsorship widgets for open source READMEs.
Day Pass Finder :: Book day passes at cafes and coworking spaces in any city.
Conversation Slots :: Native speakers sell twenty-minute conversation practice slots.
Pet Plan Comparator :: Compares pet insurance plans for your exact breed and age.
Wedding Budget Referee :: A shared wedding budget that gently tells couples which cost is out of line.
Micro-Agency in a Box :: A template site plus proposal generator for one-person design agencies.
`),
  },
  {
    key: "world",
    name: "Change the World",
    emoji: "🌍",
    color: "#2779bd",
    ideas: lines(`
Food Rescue Alerts :: Bakeries post end-of-day leftovers and nearby shelters get an instant alert.
Blood Donor Buddy :: Reminds you the day you can donate again and books the nearest slot.
Accessible Route Map :: A crowdsourced map of ramps, elevators and broken lifts for wheelchair users.
Scary Letter Decoder :: Paste a scary government letter and learn what it means and what to do next.
Elder Call Roster :: Volunteers sign up to call an isolated senior once a week.
Repair Cafe Finder :: A map of places that fix things instead of throwing them away.
Carbon Receipt :: Scan a grocery receipt, see its footprint, and get one easy swap.
Asylum Paperwork Guide :: Step-by-step checklists for asylum paperwork in thirty languages.
Classroom Wishlist :: Teachers post what their classroom needs and neighbors fund it directly.
Tree Tracker :: Log every tree you plant with a photo and GPS, and watch the forest grow on a map.
Grandparent Pill Reminder :: Huge buttons, voice reminders, and family gets notified if a dose is missed.
Street Tool Library :: Lend and borrow drills, ladders and pressure washers on your street.
Thirty-Second Mood Check :: A daily mood check-in that surfaces real help when things dip.
Volunteer Passport :: Log volunteer hours across organizations and export them for school or jobs.
Water Quality Map :: Water reports and boil notices near you, explained simply.
Vote in Sixty Seconds :: Enter your address and learn where, when and how to vote.
Litter Leaderboard :: Photo-verified trash pickups and a friendly neighborhood leaderboard.
Five Signs a Day :: Learn five sign-language signs a day from tiny video clips.
Safety Exit App :: A disguised app with a quick-exit button, safety plans and hotlines for abuse survivors.
Free Tutoring Bridge :: University students tutor kids from low-income families over video.
Disaster Check-In :: A simple I-am-safe check-in map for families after floods or earthquakes.
Pantry Needs Board :: Food pantries post what they need most right now, so donations match.
Energy Bill Decoder :: Upload your energy bill and get the three biggest savings for your home.
Uniform Swap :: Parents swap outgrown school uniforms by size and school.
Hear Your Site :: Paste a URL and hear how a screen-reader user experiences your website.
Bike Lane Snitch :: Photograph a blocked bike lane and it goes straight to the city with location.
Kid Micro-Grants :: Kids pitch small projects and the community funds fifty-dollar grants.
Doctor Note Explainer :: Paste a medical note and get it explained kindly in plain words.
Donation Router :: Tells you which nearby charity actually needs the stuff you want to donate.
Pollinator Planner :: Enter your region and get a bee-friendly planting plan for your balcony or yard.
Open Now Services :: Shelters, showers and meals that are open right now, working offline.
Second Chance Interviews :: Mock interviews and resume help for people leaving prison.
Heatwave Buddy :: Pairs neighbors to check on vulnerable people during heatwaves.
Scam Drill for Parents :: Send your parents harmless fake scam texts and teach them what to spot.
Nonprofit Good First Issues :: A board of beginner-friendly issues from nonprofit codebases.
Little Library Live :: A map of little free libraries with what is inside them right now.
Hospital Ride Share :: Matches rural patients who need a ride to treatment with volunteer drivers.
Expiring First :: Photograph your fridge and get recipes for whatever expires soonest.
Kindness Streak :: One small kind act prompt a day, with streaks and zero guilt.
Beach Haul Log :: Log beach cleanup hauls in a format ocean researchers can use.
Period Product Map :: Where to find free pads and tampons in schools and public buildings.
Wildlife Crossing Reporter :: Log roadkill hotspots so cities know where to build crossings.
Teen Tech Helpers :: Teens book video calls to help seniors with their phones.
Receipts-Only Charity :: A donation tracker that shows exactly how every dollar was spent.
Clean Air Walk :: Routes kids to school through the least polluted streets.
Community Fridge Map :: Public fridges near you and what is in them today.
Dyslexia Reader :: Paste any text and read it with a friendly font, spacing and read-aloud.
Newcomer Phrasebook :: Survival phrases for your new country organized by real situations.
Rent Hike Checker :: Find out if your rent increase is legal where you live.
Mentor Bridge :: Thirty-minute mentor calls between experienced founders and first-timers in developing countries.
`),
  },
  {
    key: "funny",
    name: "Absurd & Funny",
    emoji: "🤡",
    color: "#e3342f",
    ideas: lines(`
Standup Excuse Engine :: Increasingly elaborate excuses for missing standup, rated by believability.
Passive-Aggressive Post-It :: Generates office fridge notes in twelve escalating levels of passive aggression.
Michelin Sandwich Critic :: Upload a sandwich and an AI food critic reviews it with devastating seriousness.
Pigeon Stock Exchange :: Trade fictional shares in the pigeons of your city.
Shakespearean Weather :: Tomorrow's forecast, narrated as a five-act tragedy.
Meeting Bingo Live :: Multiplayer buzzword bingo for your next all-hands.
Wrong Cat Translator :: Records your cat and confidently mistranslates every meow.
LinkedIn Lunatic :: Turns mundane events into LinkedIn posts. I dropped my toast. Here is what it taught me about B2B sales.
Applause on Demand :: A button that plays a roaring crowd whenever you finish a chore.
Doom Scroll Tax :: Every hour on social media donates a dollar from you to charity.
Houseplant Tinder :: Swipe right to match houseplants that would look good together.
Complaints Department of the Universe :: File formal complaints about gravity, Mondays and socks. Get official responses.
App Breakup Letters :: Writes heartfelt goodbye letters to the apps you uninstall.
Grandma Code Review :: Your code review comments rewritten by a loving but disappointed grandmother.
Judgy Fridge :: A fridge-cam app that sighs audibly when you open it at 2am.
Villain Origin Story :: Describe one minor inconvenience and get your full villain backstory.
Lone Sock Registry :: Report a lonely sock and search the global database for its soulmate.
Emoji Court :: Friends submit petty disputes and a jury rules using emojis only.
Office Chair Grand Prix :: Timing, brackets and a leaderboard for office chair races.
Villain Motivation :: Daily motivational quotes from fictional villains.
Procrastination Planner :: Optimally schedules your procrastination so you never feel guilty again.
Rubber Duck Hotline :: Explain your bug to an animated duck that quacks thoughtfully back.
Negotiating Alarm Clock :: To snooze, you must win an argument against the AI.
Dev Horoscopes :: Mercury is in retrograde. Do not deploy on Friday.
Look Busy Screen :: A convincing fake loading screen for when you just need to think.
Petty Wi-Fi Names :: Generates passive-aggressive Wi-Fi names aimed at your neighbors.
Parking Spot Haiku :: Leave anonymous haikus pinned to parking spots for the next driver.
Morning Speedrun :: A global leaderboard for the fastest morning routines, with splits.
Reply-All Apocalypse :: Watch a simulated company email thread spiral into chaos.
Pet LinkedIn :: A professional resume and endorsements page for your dog.
Overthinking Visualizer :: Type the text you want to send and see forty ways it could be misread.
Banana for Scale :: Upload any photo and get its size measured in bananas.
Evil Autocorrect :: Shows what your message would say if autocorrect had a grudge.
Snack Stock Market :: Office snacks priced live by demand. Buy low, eat high.
Chore Wheel of Doom :: Dramatic roommate chore assignment with suspense music and a spotlight.
Wholesome Conspiracies :: Harmless conspiracy theories about your coworkers. Dave is secretly three raccoons.
Unnecessary Pie Chart :: Turns any sentence into a pie chart nobody asked for.
Dramatic Exit :: Leave a video call with a cinematic explosion and slow-motion walk away.
Rate My Parking :: Photograph terrible parking and let the internet judge it.
The Button :: A single button, a global counter, and absolutely no explanation.
Graceful Group Chat Exit :: Generates a dignified farewell when you leave a group chat.
Codebase Mood Ring :: Reads your commit messages and shows the emotional state of your repo.
Plant Obituaries :: Beautiful memorial pages for the houseplants you did not keep alive.
Pineapple Tribunal :: Settle pizza topping disputes with a formal, binding vote.
Spreadsheet Love Letter :: Write a love letter that only reveals itself when the formula runs.
Couponing for Time :: Finds five-minute gaps in your calendar and lets you redeem them.
Commute Quest :: Your bus ride becomes a text adventure with stops as dungeon levels.
Scream Exchange :: Record a scream and it gets played to a random stranger somewhere.
Pirate Lingo Academy :: Learn fluent pirate in thirty days with streaks and parrots.
Useless Superpower :: Get assigned a superpower, like always finding the end of the tape.
`),
  },
  {
    key: "dev",
    name: "Dev Tools",
    emoji: "🛠️",
    color: "#6c5ce7",
    ideas: lines(`
README Roaster :: Paste a README, get a score out of ten and a rewrite that sells.
Env Diff :: Compare .env files across environments and spot missing keys without showing values.
Regex Railroad :: Paste a regex and see it as a railroad diagram with plain-English steps.
Diff to Commit :: Turns a git diff into a clear conventional commit message.
Instant Mock API :: Paste JSON and get a live mock endpoint URL in one click.
Cron Whisperer :: Plain English to cron and back, with the next ten run times.
Dependency Graveyard :: Scans package.json for abandoned packages and suggests living alternatives.
Screenshot to Tailwind :: Upload a UI screenshot and get clean Tailwind HTML.
Stack Trace Sherpa :: Paste a stack trace and get the likely cause and linked GitHub issues.
Pretty Tunnels :: A localhost tunnel with memorable URLs and a request log.
Join Visualizer :: See your SQL joins as animated Venn diagrams.
JSON to Zod :: Paste JSON and get TypeScript types plus a Zod schema.
PR Storyteller :: Writes a pull request description from the diff, with a testing checklist.
Flags in a File :: A feature flag dashboard for solo devs, backed by one JSON file.
Lighthouse Diary :: Tracks a site's performance scores daily and charts regressions.
Docs Link Doctor :: Crawls a docs site and reports every dead link and missing anchor.
Webhook Catcher :: Catch, inspect and replay webhooks from any service.
Git Blame Therapist :: Shows who wrote this line and why, with kindness and context.
Brand Extractor :: Enter a URL and pull its colors, fonts and logo as design tokens.
OG Image API :: Beautiful social cards from URL parameters.
Context Cheatsheet :: Suggests terminal commands based on the project you are in.
Specificity Arena :: Two CSS selectors enter, one leaves, with the math explained.
Bundle Budget Bot :: Comments on pull requests when the bundle grows past a budget.
Animated Code Cards :: Code snippets rendered as animated images for social posts.
Side Project Uptime :: An uptime monitor that texts you when a side project goes down.
Schema Seeder :: Realistic fake seed data generated from your database schema.
HTTP Cats Flashcards :: Learn every HTTP status code with a cat for each one.
Tech Debt Milk :: Tags TODOs in code and shows them aging like milk in a fridge.
Token Converter :: Figma variables to CSS, Tailwind and Swift in one paste.
Monorepo Map :: An interactive dependency graph for your monorepo packages.
String Extractor :: Finds hardcoded UI strings and extracts them into i18n JSON.
Prompt Vault :: Version-control your AI prompts with diffs and regression tests.
LLM Bill Estimator :: Estimates your AI bill from expected traffic and prompt sizes.
Compose Visualizer :: Draws your docker-compose file as a service diagram.
Timezone Overlap :: Finds meeting times that are humane for a distributed team.
Extension Starter :: Generates a ready-to-load browser extension from a description.
Rate Limit Tester :: Safely hammers your own API and charts response times and 429s.
Favicon Everything :: One image in, every favicon size and manifest out.
Markdown Resume :: Write your resume in Markdown and get a beautiful PDF.
Repo Onboarding Guide :: Scans a repo and writes how this codebase works for new contributors.
Flaky Test Detective :: Runs your test suite many times and ranks the flakiest tests.
Code Vibe Check :: Rates the vibe of a file and suggests refactors with personality.
Deploy Button Maker :: Generates one-click deploy buttons for any repo.
Standup from Git :: Writes your standup update from yesterday's commits and PRs.
Secret Scan Explainer :: A pre-commit hook that catches secrets and explains why each one matters.
Shortcut Dojo :: A game that trains you on editor keyboard shortcuts.
Changelog from Tags :: Builds release notes from git tags and merged pull requests.
API Diff Watch :: Alerts you when a third-party API's OpenAPI spec changes.
Color Contrast Fixer :: Paste two colors and get the nearest accessible pair.
Error Budget Board :: A tiny SLO dashboard for teams without an SRE.
`),
  },
  {
    key: "games",
    name: "Games & Toys",
    emoji: "🎮",
    color: "#f6993f",
    ideas: lines(`
Satellite Guessr :: Guess the country from a tiny satellite snippet. One puzzle a day.
Emoji Movie Wordle :: Guess the movie from five emojis in six tries.
Drawing Telephone :: A multiplayer game of draw, describe, draw again. Laughter guaranteed.
Tab Title Tower Defense :: A tower defense game that lives entirely in the browser tab title.
Guess the Year :: A historic photo appears. Guess the year it was taken.
Lyric Typing Racer :: Race friends by typing song lyrics in time with the beat.
Startup Idle Clicker :: Click to raise funding, hire interns and survive the burn rate.
One-Page Escape Room :: An escape room hidden inside a single web page.
Pixel Garden :: Everyone on Earth plants one pixel per day on a shared garden.
Chess Variant Lab :: Invent chess variants with custom pieces and play them online.
Trivia Night Host :: Big-screen questions with phones as buzzers.
Adventure Book Maker :: Build choose-your-own-adventure stories with a visual map.
Grocery Price Guessr :: Guess what a loaf of bread costs in Tokyo, Lagos or Oslo.
MP3 Rhythm Game :: Upload a song you own and get a generated rhythm level.
Commit Tamagotchi :: A virtual pet that thrives on your GitHub commits and wilts without them.
Global Daily Sudoku :: One sudoku per day with a worldwide leaderboard.
Marble Run Sandbox :: Build physics marble runs and share them by link.
Planet Snake :: Multiplayer snake on a globe with players worldwide.
Guess the Language :: Hear a clip of speech and guess the language.
Hot Take Arena :: Two opinions, one vote, and a live world tally.
Minigolf Editor :: Design minigolf holes and challenge friends to beat your par.
Group Chat Crossword :: A crossword generated from your group chat's inside jokes.
Bubble Wrap Forever :: Endless bubble wrap popping with satisfying sound design.
Reality TV Fantasy League :: Draft contestants and score points for drama.
Birdsong Quiz :: Learn birds by their songs, level by level.
Board Game Scorekeeper :: A scorekeeper for any board game with stats over time.
Spot the AI :: Real photo or AI? A daily quiz with global accuracy stats.
Trolley Problem Stats :: Absurd trolley dilemmas and how the world voted.
Custom Card Game Engine :: Design your own deck and play it online with friends.
Chore Quest :: Household chores become RPG quests with XP and loot for kids.
Paper Plane Lab :: Fold virtual planes and test them in a wind tunnel.
Emoji Fusion Battle :: Combine emojis into creatures and battle them.
Type to Shoot :: Asteroids where you destroy rocks by typing the words on them.
GPS Treasure Hunt Maker :: Make a treasure hunt with GPS clues for a birthday party.
Daily Maze :: A new maze every day and a ghost replay of the fastest run.
Charades Randomizer :: Party charades with categories, a timer and team scores.
Flag Speedrun :: Name all flags as fast as possible and chase your best split.
Terminal Dungeon :: A roguelike you run with one npx command.
Tiny City Builder :: A city builder on a 100 by 100 grid that fits in one tab.
Guess the Elo :: Watch a chess game and guess the players' rating.
Work Email Mad Libs :: Mad libs built from real corporate email templates.
Rock Paper Scissors League :: Ranked rock paper scissors with seasons and Elo.
Would You Rather Worldwide :: Would-you-rather dilemmas with live global percentages.
Ghost Racer :: A tiny top-down racer where you race your own ghost.
Blind Test Party :: A music blind test where friends buzz in from their phones.
Nonogram Factory :: Generates picture logic puzzles from any image.
Floor Is Lava :: A kids party timer that randomly yells floor is lava.
Word Chain Duel :: Each word must start with the last letter of the previous one. Fast.
Gravity Golf :: Golf across planets with gravity slingshots.
Hide and Seek Map :: Hide an object in a panoramic photo for friends to find.
`),
  },
  {
    key: "ai",
    name: "AI Weirdness",
    emoji: "🤖",
    color: "#9561e2",
    ideas: lines(`
Argue With Past You :: Debate an AI trained on your old posts and see who wins.
Historical Group Chat :: Napoleon, Cleopatra and Tesla in one group chat, arguing about your problem.
Raise Rehearsal :: Practice asking for a raise against an AI boss with realistic pushback.
Voice Memo to Blog :: Ramble into your phone and get a polished blog post.
Wardrobe Stylist :: Photograph your clothes once and get outfits for every occasion.
ELI5 Slider :: Explain anything with a slider from five-year-old to PhD.
Thumbnail Predictor :: Upload two thumbnails and get a prediction of which gets more clicks.
PDF to Podcast :: Any PDF becomes a two-host podcast episode.
Emotional Support Toaster :: An AI toaster that believes in you. Deeply.
AI Roast Battle :: Roast the AI and it roasts you back. Audience votes.
Bedtime Story Hero :: Personalized bedtime stories where your kid is the hero.
Nagging Meeting Notes :: Meeting notes that assign action items and follow up until they are done.
Leaf Doctor :: Photograph a sick leaf and get a diagnosis and treatment.
Napkin to Website :: Draw a site on a napkin, snap it, and get working HTML.
Budget Travel Planner :: A trip planner that respects your real budget down to the coffee.
Song of Your Day :: Describe your day and get a song about it.
Debate Judge :: Two people argue, the AI scores logic and evidence.
Tone Slider :: Rewrite any email on a slider from CEO to golden retriever.
Mistake-Remembering Tutor :: A language partner that remembers your mistakes and drills them.
Coloring Page Maker :: Turn any photo into a printable coloring book page.
Talking Houseplants :: Your plants tell you how they feel based on care logs.
Clone Support Desk :: An AI support agent trained on your own past replies.
Movie Night Negotiator :: Everyone lists preferences and the AI finds the one film nobody hates.
Week as a Comic :: Your calendar and notes become a four-panel comic.
Catch Me Up :: Summarizes the group chat you muted for a week.
Reverse Interview :: The AI helps you interrogate a company before you accept the job.
Second Brain Chat :: Chat with your own notes and get sources for every answer.
Gift Oracle :: Describe the person and get gift ideas they will actually love.
Soreness-Aware Coach :: A workout coach that adapts to how sore you are today.
Dating Profile Honesty Check :: Rates how your dating profile comes across and why.
Tabletop Game Master :: An AI game master for tabletop campaigns with maps and NPCs.
Company Slack Poet :: A poet laureate that writes an ode for every shipped feature.
Food Label Decoder :: Photograph an ingredient list and learn what everything is.
Filler Word Coach :: Rehearse a speech and count every um, like and basically.
Meme Explainer for Parents :: Explains memes to your parents without making it worse.
Public Domain Book Chat :: Ask questions to any public-domain book, answered in its voice.
Handwriting to Font :: Write the alphabet on paper and get your own font file.
Improv Partner :: A yes-and improv partner for practicing comedy and creativity.
Morning AI Newspaper :: A one-page newspaper about only the things you care about.
Spot the Difference AI :: Upload two photos and see exactly what changed.
Roommate Mediator :: A neutral AI mediator for dishes, noise and rent disputes.
Startup Name Forge :: Startup names with instant domain availability.
Time Capsule Letter :: Write to future you and the AI adds predictions to check later.
Fridge Photo Chef :: Photograph your fridge and get three recipes you can make now.
Codebase Chat :: Ask any repo how it works and get answers with file links.
Dream Journal Artist :: Record a dream and get an interpretation plus a painting of it.
Pet Name Consultant :: A very serious consultant for naming your new pet.
Negotiation Dojo :: Practice buying a car against a stubborn AI salesperson.
Accent Coach :: Record a sentence and get feedback on pronunciation.
Alt Text Machine :: Bulk-generate alt text for every image on a website.
`),
  },
  {
    key: "life",
    name: "Everyday Life",
    emoji: "🏡",
    color: "#38c172",
    ideas: lines(`
Receipt Splitter :: Photograph the receipt, tap who had what, and everyone gets a payment link.
Plant Watering Buddy :: Watering reminders tuned to each plant's species and season.
Warranty Vault :: Photograph receipts and warranties and get reminded before they expire.
Meal Plan to Grocery List :: Pick meals for the week and get a grocery list sorted by aisle.
Roommate Chores :: A fair chore rotation with gentle nudges and zero drama.
One-Button Habit :: A habit tracker with exactly one button per habit.
Where Did I Park :: Saves your parking spot and meter time with one tap.
Birthday Budgeter :: Birthday reminders with a gift budget and idea list per person.
Smart Packing List :: A packing list from your destination, weather and trip length.
Home Inventory :: Video-walk your home and get an inventory for insurance.
Screen Time Bank :: Kids earn screen time by finishing chores.
Car Care Log :: Tracks oil changes, tires and inspections with reminders.
Recipe Scaler :: Scale any recipe up or down with sensible unit conversion.
Pantry Expiry Radar :: Know what is about to expire before it does.
Moving Day Checklist :: A timeline for moving house, from boxes to address changes.
Kitchen Family Calendar :: A shared family calendar designed for an old tablet on the fridge.
Laundry Symbol Decoder :: Photograph a clothing tag and learn how to wash it.
Did Anyone Feed the Cat :: A shared pet feeding log for the whole household.
Sleep Debt Tracker :: Shows how much sleep you owe and how to pay it back.
Emergency Info Card :: One page with family medical info and contacts for emergencies.
Weighted Decision Maker :: Pros and cons with weights, and a clear answer at the end.
Medicine Cabinet Check :: Tracks expiry dates of everything in the medicine cabinet.
Guest Wi-Fi QR :: Print a pretty QR code guests scan to join your Wi-Fi.
Neighborhood Lost and Found :: Post and find lost keys, pets and gloves near you.
Garage Sale Map :: A map of garage sales this weekend with item previews.
Universal Registry :: A gift registry for anything: babies, moves, graduations.
Bike Today :: Tells you whether today is a good day to bike to work.
Envelope Budget :: The cash envelope method, digital and dead simple.
Home Energy Dashboard :: Understand where your home energy goes month by month.
Library Due Dates :: Tracks library loans for the whole family.
Aisle-Sorted Shopping :: A shopping list that sorts itself by your store's layout.
Babysitter Sheet :: Generates a clear info sheet for babysitters in two minutes.
Dinner Roulette :: Cannot decide what to eat? Spin for dinner.
Reading Streaks :: A book tracker with streaks, quotes and yearly stats.
One Question Journal :: A journal that asks one good question per day.
Room-by-Room Cleaning :: A cleaning schedule that rotates rooms so nothing piles up.
Group Trip Expenses :: Split expenses on a group trip and settle up with minimal transfers.
Cheap Gas Nearby :: The cheapest fuel near you with price history.
DIY Project Planner :: Plan a DIY project with a materials list and cost estimate.
School Run Carpool :: Coordinate school pickups between parents with a shared schedule.
Coffee Brew Timer :: Brew timers with recipes for pour-over, AeroPress and French press.
Houseguest Guide :: A welcome page for guests with keys, Wi-Fi, rules and local tips.
Rainy Weekend Planner :: Weekend ideas based on the weather forecast and your city.
Duplicate Photo Sweeper :: Finds duplicate and blurry photos to free up space.
Voice Grocery List :: Say what you need and it lands on the shared list.
Tipping Abroad :: How much to tip in any country, with local etiquette.
Leftover Tracker :: Logs leftovers in the fridge so nothing becomes a science project.
Morning Dashboard :: Weather, transit and calendar on one glanceable screen.
Bill Due Calendar :: All your bills on one calendar with reminders before each due date.
Appliance Manual Finder :: Photograph an appliance and get its manual and common fixes.
`),
  },
  {
    key: "art",
    name: "Creative & Art",
    emoji: "🎨",
    color: "#f66d9b",
    ideas: lines(`
One-Word Poster :: Type a single word and get a generative art poster.
Infinite Shared Canvas :: A collaborative canvas that never ends, where everyone draws together.
Lyric Visualizer :: Animated typography videos for song lyrics.
Animated Pixel Studio :: A pixel art editor with onion skinning and GIF export.
Fridge Poetry Magnets :: Multiplayer virtual fridge poetry magnets.
Photo Mosaic Maker :: Rebuild a photo from hundreds of your other photos.
Draw to Hear :: Draw lines and shapes that play music as they are traced.
Font Pairing Playground :: Try heading and body font pairs on real layouts.
Name Wallpaper :: Generative wallpapers seeded from your name.
Story Dice :: Roll dice with pictures and write a story from them.
Painting Palettes :: The color palettes of famous paintings, ready to copy.
Browser Beat Maker :: A step sequencer with drum kits right in the browser.
Comic Panel Builder :: Lay out comic panels and speech bubbles fast.
Daily Doodle Prompt :: One drawing prompt per day and a gallery of everyone's answers.
Typewriter Mode :: A writing app where you cannot delete. Only forward.
ASCII Camera :: Your webcam, rendered live in ASCII art.
Album Cover Generator :: Invent an album cover for a band that does not exist.
One Sentence Story :: A collaborative story where everyone adds one sentence.
Kaleidoscope Webcam :: Turn your webcam into a mesmerizing kaleidoscope.
Spirograph Studio :: Digital spirograph with gears, colors and SVG export.
Handwriting Animator :: Animate your handwriting as if it were being written live.
Zine Maker :: Design an eight-page zine that prints and folds from one sheet.
Music Moodboard :: A moodboard of songs, colors and images for a project.
Tattoo Sketcher :: Describe an idea and get tattoo sketches in different styles.
Photo to Poem :: Upload a photo and get a poem about it.
Stop Motion Studio :: Make stop motion animations with your webcam.
L-System Garden :: Grow generative plants from simple rules.
Retro Photo Booth :: A photo booth with film filters and printable strips.
Screenplay Formatter :: Write screenplays with correct formatting automatically.
Knitting Pattern Designer :: Design knitting charts and export patterns.
Rhyme Finder :: A rhyming dictionary tuned for lyrics and rap.
Paint by Numbers :: Turn any photo into a paint-by-numbers template.
Glitch Art Generator :: Glitch images with sliders for datamosh, pixel sort and noise.
City Map Poster :: Beautiful minimalist map posters of any city.
Worldbuilding Wiki :: A wiki for fiction writers with maps, timelines and characters.
Voice Loop Station :: Layer loops of your voice into a song.
Friend Constellations :: Turn your friends' names into star constellations.
Isometric Room Designer :: Design cozy isometric rooms and share them.
Focus Music Generator :: Endless generative music tuned for focus.
Film Grain Editor :: Add authentic film grain and light leaks to photos.
Book Cover Mockups :: Put your book cover on realistic 3D mockups.
Character Name Generator :: Names for characters by era, region and personality.
Doodle to Animation :: Animate a doodle with simple motion paths.
Visual Tuner :: A musical instrument tuner with beautiful visuals.
Photo Palette Extractor :: Pull the five key colors from any photo.
Year Wrapped Poster :: A wrapped-style poster from any stats you upload.
Graffiti Wall :: A shared digital wall for spray-paint art.
Weekly Micro-Fiction :: A weekly fifty-word story contest with voting.
Generative Rug Designer :: Design rugs with generative patterns and export for weaving.
Shadow Puppet Theater :: Make shadow puppet shows with your hands on webcam.
`),
  },
];

// Twists stack onto any idea for an extra dose of chaos. 400 ideas x 40 twists.
export const TWISTS: string[] = lines(`
...but it must work fully offline.
...but the entire UI is a chat conversation.
...but it is designed for dogs.
...but for people over 80.
...but it only works between 11pm and 1am.
...but everything is voice-controlled.
...but in the style of a 90s website.
...but it runs entirely in the terminal.
...but multiplayer, in real time.
...but each user gets exactly one action per day.
...but the whole app fits in one screen with no scrolling.
...but as a browser extension.
...but it speaks only in pirate.
...but everything costs one cent.
...but it is a physical-world scavenger hunt.
...but it has a villain narrator.
...but built for kids aged 6 to 10.
...but it must be usable with one thumb.
...but every action plays a sound effect.
...but powered only by SMS.
...but for a specific city you love.
...but with a leaderboard.
...but it runs on a smartwatch.
...but it is a Slack or Discord bot.
...but everything is anonymous.
...but it is dark mode only and very moody.
...but the AI is way too enthusiastic.
...but no text allowed, only icons.
...but it has to be under 100 lines of code.
...but it is a daily ritual that takes 30 seconds.
...but it turns everything into a game show.
...but for astronauts on a long mission.
...but with a Nordic minimalist design.
...but it is open source and self-hostable.
...but it gives away a real prize once a week.
...but it is for a team of exactly two people.
...but it prints something on paper.
...but made for a medieval kingdom.
...but everything is shaped like a cat.
...but it must launch today.
`);

export type Pick = { cat: number; idx: number; twist: number | null };

export const parseIdea = (raw: string) => {
  const [title, pitch] = raw.split(" :: ");
  return { title, pitch };
};
