# 3.1 Gathering Techniques

Gathering techniques are established techniques for requirements elicitation. They help to elicit satisfiers and dissatisfiers. This term groups:

- **Questioning techniques** (interview and questionnaire)
- **Observation techniques** (field observation, apprenticing, contextual inquiry)
- **Collaboration techniques** (requirements workshop and crowd-based Requirements Engineering)
- **Artifact-based techniques** (perspective-based reading, system archaeology, and reuse of requirements)

*(see Figure 17: Overview of elicitation techniques)*

## 3.1.1 Questioning Techniques

Questioning techniques aim to pose appropriate questions to stakeholders in order to receive answers from which requirements can be derived.

### Open-ended and Closed-ended Questions

For all questioning techniques covered in this section, it is important to know the distinction between open-ended and closed-ended questions.

- **Closed-ended questions**: the answers are given or defined, either by the question itself or by explicit reference to the available answers (e.g. *How old are you? Do you like fish?*). Closed-ended questions lead to **quantitative data**, i.e. data that can be processed statistically without further adaptation.
- **Open-ended questions**: allow a free response, in order to query narrative or argumentative knowledge, and therefore lead to **qualitative data** (e.g. *What is your favorite dish? How do airplanes fly?*). Qualitative data can only be evaluated by cognitive analysis.

In the context of requirements elicitation, predominantly qualitative data is required. Therefore, mainly open-ended questions are needed. However, there are also situations requiring quantitative data (e.g. evaluating whether the statement of one representative user is confirmed by other users). Here, closed-ended questions should be used.

When using questioning techniques in an elicitation activity, the result quality definition should include whether qualitative or quantitative data should be elicited.

The following describes the two most relevant questioning techniques: **interview** and **questionnaire**.

### AI Support for Elicitation Techniques

The use of artificial intelligence, in particular generative AI and large language models, can provide targeted support for the planning and execution of proven elicitation techniques and make them more efficient:

- AI-supported tools can help the Requirements Engineer systematically prepare interviews, e.g. by automatically generating relevant questions or topics.
- For observation techniques, AI can help suggest meaningful observation objectives and criteria based on past experiences or existing project data.
- AI supports workshop planning by identifying topics and content particularly relevant for certain stakeholder groups.
- Through automated evaluation of existing data and documents, AI recognizes patterns and connections helpful in selecting suitable elicitation techniques and their targeted application.

This technology-supported approach improves the quality and efficiency of known methods, while human expertise and responsibility of the Requirements Engineer remains indispensable. Particularly for requirements supplemented or created by AI, the Requirements Engineer must always critically question whether these are desired and whether traceability (e.g. requirement source, assignability, necessity) is documented.

---

## 3.1.1.1 Interview

Due to their flexibility, interviews are probably one of the most frequently-used elicitation techniques. They do not require a big setup or specific tools, and can be used to elicit high-level requirements as well as very specific ones. Typically, requirements elicited with an interview are **satisfiers**, as the interviewee voices conscious information. By using the right questioning techniques and observing the user's reactions, however, **dissatisfiers** or **delighters** may also be identified.

Although an interview is not very complicated and most people have a good understanding of what it is, it requires clear goals and detailed preparation in order to make good use of the interview time and obtain valuable and sustainable results.

### What is an Interview?

In an interview, the Requirements Engineer asks one or more stakeholders questions in order to elicit new requirements or to refine existing ones (elicitation objective). The stakeholders answer these questions and the Requirements Engineer (or an assistant) records the information he/she receives.

An interview differs from a plain conversation due mainly to three factors: **the role of the participants**, **preparation**, and **result processing**.

### Role of Participants

In an interview, three roles are mandatory: **interviewer**, **interviewee**, and **note-taker**.

- **Interviewer**: The Requirements Engineer takes this role. It is their obligation to prepare and conduct the interview, and to process the information gathered. An interviewer should be: knowledgeable, structuring, clear, gentle, sensitive, open, steering, critical, remembering, and interpreting (based on [Kvale2008]).
- **Interviewee**: The stakeholder. They answer the questions asked by the interviewer, thus expressing their requirements.
- **Note-taker**: Records all relevant information provided by the interviewee. They need to know in advance the elicitation objective of the interview and must know and understand the interview guide. Only if the note-taker knows the context of the interview and the topic (including terminology) sufficiently, are they able to follow the interview and decide which information to take down and which not.

> The interviewer may also take over the role of note-taker. If possible, however, this should be avoided, as it requires the interviewer to jump back and forth between two different cognitive modes, requiring additional energy and usually negatively affecting performance in both roles. The role of note-taker may be replaced by a sound or video recording device (see Preparation for advantages and disadvantages).

### Preparation

1. **Define the elicitation objective(s)** and the required result quality as part of defining the elicitation activity (see 1.3.1).
2. **Select a suitable stakeholder(s)** for the interview who you expect will be able to answer your questions in order to reach your elicitation objective(s), while achieving the required result quality. You will never know for sure in advance whether you have selected the right stakeholders — good stakeholder management and properly researched stakeholder documentation significantly increases the chance of making a good choice.
3. **Prepare an interview guide.** There are many different ways to do this: some prefer a list of bullet points showing the intended order and hierarchy of questions; others prefer a mind-map style guide, where questions are ordered clockwise around the interview objective — this can make it easier to follow the interviewee's trail of thought as they jump between topics. The interviewer develops an overall structure for the interview, reflected by the interview guide: how to do introductions, the purpose of the interview, the kick-off question, the order of questions, and how the interview should end. The guide does not have to contain the exact wording of questions (at least in a qualitative interview), but interviewers should still think about how to phrase their questions clearly.
4. **Organize time and place.** Set a suitable time that fits the interviewee's schedule. Add roughly 15 minutes as warm-up time/buffer. The interview itself should not exceed 60 minutes — for most interviewers and interviewees, 20–40 minutes is a good time frame. The interview should take place in a separate room allowing for concentration and confidentiality, ideally close to and convenient for the interviewee.
5. **Decide how the interview should be recorded.** There are three options: the interviewer takes notes, a note-taker takes notes, or an audio/video recording is made.

#### Recording Method: Advantages and Disadvantages

| | **Interviewer takes notes** | **Note-taker takes notes** | **Audio/video recording** |
|---|---|---|---|
| **Advantages** | No additional person or device is required. While taking notes, interviewer and interviewee gain time to think. | The interviewer can concentrate fully on posing questions and listening to/observing the interviewee. Interviewer and note-taker have two perspectives on the same event (possibility to uncover cognitive biases). | The interviewer can concentrate fully on posing questions and listening to/observing the interviewee. All information is available unfiltered after the interview. |
| **Disadvantages** | Some information may get lost or distorted. The interviewer has to switch between two cognitive modes (requires energy). During note-taking, long awkward pauses may arise. Notes are usually very short and may not be understood anymore after the interview. | Some information may get lost or distorted. If the note-taker is not fully involved in the interview topic, they might misunderstand information and take down wrong or incomplete information. | Information filtering starts only after the interview; the whole interview has to be listened to again. Legal restrictions may apply, depending on national law or company regulations. The interviewee might prohibit the recording. |

> **Hint 3.1.1:** Often options 1 and 3 are combined, i.e. the interview is recorded and the interviewer still takes some notes (but can focus mainly on asking questions and listening to answers). If recording of the interview is planned, it is advisable to get approval from the interviewee and their organization in advance.

### Application

During the interview, the interviewer leads the interviewee by asking questions, putting into practice the following qualifications [Kvale2008]:

- **Knowledgeable**: has extensive knowledge of the topic; knows what issues are important to pursue
- **Structuring**: prepares and follows a structure for the interview; communicates the structure to the interviewee during the interview
- **Clear**: uses simple language, and poses clear, simple, easy, and short questions
- **Gentle**: lets people finish; gives them time to think; tolerates pauses
- **Sensitive**: listens attentively to what is said and how it is said; is empathetic in dealing with the interviewee
- **Open**: responds to what is important to the interviewee; is open for new aspects introduced by the interviewee and follows them up
- **Steering**: knows what they want to find out; controls the course of the interview and is not afraid of interrupting digressions
- **Critical**: is prepared to challenge what is said, e.g. dealing with inconsistencies in interviewees' replies
- **Remembering**: can recall earlier statements and relates what is said to what has been said earlier in the interview
- **Interpreting**: clarifies and extends the meanings of the interviewee's statements; provides interpretations of what is said, which may be confirmed or negated by the interviewee

The stakeholder(s) (interviewee) answer these questions, and the Requirements Engineer (interviewer) listens carefully, checking for several things, e.g.:

- Whether the stakeholder has understood the question and is providing the desired information
- Whether the Requirements Engineer understands what the stakeholder is saying
- Whether the question is fully answered
- Whether the stakeholder is sending relevant non-verbal information
- Whether the note-taker is taking down the required information

The note-taker listens to the interviewer and interviewee, filters the relevant information from the conversation, and takes it down, watching the interviewer closely to catch non-verbal or verbal signals on what to take down.

> [Port2013] and [BaCC2015] provide more insights into the art of interviewing, focusing on user interviews.

After the interview, the interviewer and/or note-taker prepares the interview notes and sends them to the interviewee(s) for review. This serves two purposes:

1. To make sure all information from the interview has been understood correctly and no important aspect has been forgotten.
2. To show appreciation for the interviewee's time and input.

---

*Source: Requirements Elicitation | Handbook | © IREB (pp. 66–69 / 172)*
