(() => {
    "use strict";

    /*
     * Secure AI connection:
     * Leave blank while testing the front-end locally.
     * Later, set this to your serverless endpoint, e.g.
     * const AI_ENDPOINT = "https://your-domain.com/api/portfolio-chat";
     *
     * Never put an OpenAI/API secret key in this browser file.
     */
    const AI_ENDPOINT = "";

    const facts = {
        gcse:
            "Callum achieved 9 GCSEs at Honywood School in 2026: English Language 9; German 7; Mathematics 7; Chemistry 7; English Literature 7; Geography 7; Biology 6; Physics 6; and Computer Science 6.",
        education:
            "Callum attended Honywood School and plans to study Mathematics, Physics and Psychology at Colchester Sixth Form. His longer-term goal is to study Aerospace Engineering at university.",
        cadets:
            "Callum is a Sergeant with 295 (Witham & Rivenhall) Squadron RAF Air Cadets and serves as Halifax Flight Second-in-Command. He leads around 15 cadets weekly and supports roughly 60 across the squadron.",
        cadetTimeline:
            "Callum joined RAF Air Cadets in September 2023, was promoted to Corporal in March 2025, promoted to Sergeant in December 2025, and became Halifax Flight Second-in-Command in January 2026.",
        ukroc:
            "Callum worked as part of his squadron's UKROC rocketry team, helping design, develop, test and launch a competition rocket. The team achieved a Top 10 national result, improving on a previous Top 30 performance.",
        aerospace:
            "Callum's aerospace experience includes hands-on work at Earls Colne Airfield, RAF Air Cadets aviation training, Silver Space Studies, and the UKROC engineering competition. His long-term goal is a career in aerospace engineering.",
        airfield:
            "At Earls Colne Airfield, Callum assisted with aircraft cleaning, refuelling and maintenance while learning about aviation safety procedures and day-to-day airfield operations.",
        project:
            "Callum designed and developed an interactive school library website intended for real users. It included book reviews, recommendations, availability information and rewards, building his web development, planning and problem-solving skills.",
        work:
            "Callum's experience includes Earls Colne Airfield, producing social media content for Energy Efficient Homes, a paper round, school leadership responsibilities and extensive RAF Air Cadets leadership.",
        leadership:
            "Callum's leadership experience includes serving as an RAF Air Cadet Sergeant and Halifax Flight 2IC, leading around 15 cadets weekly, supporting around 60 squadron cadets, and working as a Lead Learner and Prefect at Honywood School.",
        qualifications:
            "Callum's RAFAC qualifications and awards include Master Cadet, Silver Leadership, Silver Snare Drum, Silver Space Studies, Silver Shooting (L98A2), Bronze Radio, Bronze First Aid, Bronze Duke of Edinburgh Award, Blue Wings, Blue Cyber, Blue Road Marching and the Jack Petchey Achievement Award.",
        skills:
            "Callum's strongest demonstrated skills include leadership, communication, teamwork, public speaking, problem-solving, organisation, time management, resilience, first aid, web development and practical aviation experience.",
        contact:
            "You can contact Callum at callumrider@icloud.com or 07398 156901. His portfolio is callumrider.uk and his LinkedIn is linked from the website.",
        profile:
            "Callum Rider is a student based in Essex with interests in aerospace, engineering, aviation, technology and leadership. He is an RAF Air Cadet Sergeant and aspiring aerospace engineer."
    };

    function localAnswer(question) {
        const q = question.toLowerCase();

        if (/(gcse|grade|grades|result|results|english|maths|mathematics|german|chemistry|biology|physics|geography|computer science)/.test(q)) {
            return facts.gcse;
        }

        if (/(ukroc|rocket|rocketry|competition)/.test(q)) {
            return facts.ukroc;
        }

        if (/(airfield|earls colne|aircraft|refuelling|refueling|maintenance)/.test(q)) {
            return facts.airfield;
        }

        if (/(aerospace|aviation|flying|plane|engineering experience)/.test(q)) {
            return facts.aerospace;
        }

        if (/(cadet|rafac|raf air|squadron|sergeant|halifax|2ic|second-in-command|second in command)/.test(q)) {
            if (/(when|timeline|promot|joined|progress)/.test(q)) return facts.cadetTimeline;
            return facts.cadets;
        }

        if (/(lead|leadership|prefect|lead learner|responsib)/.test(q)) {
            return facts.leadership;
        }

        if (/(qualification|award|master cadet|silver|bronze|jack petchey|duke of edinburgh|dofe)/.test(q)) {
            return facts.qualifications;
        }

        if (/(library|website|web development|programming|software|project)/.test(q)) {
            return facts.project;
        }

        if (/(work experience|job|employment|work|energy efficient|paper round)/.test(q)) {
            return facts.work;
        }

        if (/(sixth form|a level|a-level|university|education|school|study|studying)/.test(q)) {
            return facts.education;
        }

        if (/(skill|strength|ability|abilities)/.test(q)) {
            return facts.skills;
        }

        if (/(contact|email|phone|linkedin|website|reach)/.test(q)) {
            return facts.contact;
        }

        if (/(who is|about callum|tell me about|summary|profile)/.test(q)) {
            return facts.profile;
        }

        return "I can currently answer questions about Callum's GCSEs, education, RAF Air Cadets experience, UKROC, aerospace experience, projects, qualifications, work experience, skills and contact details. Try asking about one of those areas.";
    }

    async function getAnswer(question) {
        if (!AI_ENDPOINT) {
            await new Promise((resolve) => window.setTimeout(resolve, 260));
            return localAnswer(question);
        }

        try {
            const response = await fetch(AI_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: question })
            });

            if (!response.ok) throw new Error(`Request failed: ${response.status}`);

            const data = await response.json();
            if (!data || typeof data.answer !== "string" || !data.answer.trim()) {
                throw new Error("Invalid response");
            }

            return data.answer.trim();
        } catch (error) {
            console.warn("Portfolio assistant backend unavailable; using local answers.", error);
            return localAnswer(question);
        }
    }

    function initPortfolioChat() {
        const launcher = document.getElementById("portfolio-chat-launcher");
        const panel = document.getElementById("portfolio-chat-panel");
        const close = document.getElementById("portfolio-chat-close");
        const form = document.getElementById("portfolio-chat-form");
        const input = document.getElementById("portfolio-chat-input");
        const messages = document.getElementById("portfolio-chat-messages");
        const suggestions = document.getElementById("portfolio-chat-suggestions");

        if (!launcher || !panel || !close || !form || !input || !messages || !suggestions) return;

        let busy = false;

        const setOpen = (open) => {
            panel.classList.toggle("is-open", open);
            panel.setAttribute("aria-hidden", String(!open));
            launcher.setAttribute("aria-expanded", String(open));
            document.body.classList.toggle("portfolio-chat-open", open);

            if (open) {
                window.setTimeout(() => input.focus(), 80);
            } else {
                launcher.focus();
            }
        };

        const appendMessage = (text, type, extraClass = "") => {
            const wrapper = document.createElement("div");
            wrapper.className = `portfolio-chat-message portfolio-chat-message-${type} ${extraClass}`.trim();

            const p = document.createElement("p");
            p.textContent = text;
            wrapper.appendChild(p);
            messages.appendChild(wrapper);
            messages.scrollTop = messages.scrollHeight;
            return wrapper;
        };

        const ask = async (question) => {
            const clean = question.trim();
            if (!clean || busy) return;

            busy = true;
            input.value = "";
            appendMessage(clean, "user");
            const loading = appendMessage("Checking the portfolio…", "assistant", "portfolio-chat-message-loading");

            const answer = await getAnswer(clean);
            loading.remove();
            appendMessage(answer, "assistant");

            busy = false;
            input.focus();
        };

        launcher.addEventListener("click", () => setOpen(true));
        close.addEventListener("click", () => setOpen(false));

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            ask(input.value);
        });

        suggestions.addEventListener("click", (event) => {
            const button = event.target.closest("[data-chat-question]");
            if (!button) return;
            ask(button.dataset.chatQuestion || button.textContent || "");
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && panel.classList.contains("is-open")) {
                setOpen(false);
            }
        });

        document.addEventListener("click", (event) => {
            if (!panel.classList.contains("is-open")) return;
            if (panel.contains(event.target) || launcher.contains(event.target)) return;

            // Keep the assistant open on desktop while users browse the page,
            // but close it when tapping outside on small screens.
            if (window.innerWidth <= 640) setOpen(false);
        });

        if (new URLSearchParams(window.location.search).get("chat") === "open") {
            setOpen(true);
        }
    }

    document.addEventListener("DOMContentLoaded", initPortfolioChat);
})();