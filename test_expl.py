import json, re

with open('src/data/driveQuestions.ts', 'r') as f:
    content = f.read()

# Extract array content from export const DRIVE_COPIED_QUESTIONS: FlashcardQuestion[] = [...];
json_part = content[content.find('['):content.rfind(']')+1]

questions = json.loads(json_part)
print("Loaded", len(questions), "questions")

def build_rich_explanation(q):
    subject = q.get("subject", "")
    question_text = q.get("question", "")
    choices = q.get("choices", [])
    correct_id = q.get("correctChoiceId", "A")
    existing_exp = q.get("explanation", "").strip()
    
    # Find choice text
    correct_choice_text = ""
    for c in choices:
        if c.get("id") == correct_id:
            correct_choice_text = c.get("text", "")
            break
            
    # Check if existing_exp is bad/redundant
    is_bad = False
    if not existing_exp:
        is_bad = True
    elif "correct answer" in existing_exp.lower():
        is_bad = True
    elif existing_exp.strip().lower() in question_text.strip().lower():
        is_bad = True
    elif len(existing_exp.split()) < 5:
        is_bad = True
        
    if not is_bad:
        return existing_exp

    # Generate a subject-specific, insightful explanation that provides background NOT in the question
    # EE LAWS
    if subject == "EE Laws" or "ra 7920" in question_text.lower() or "board" in question_text.lower() or "ee law" in question_text.lower():
        if "7920" in question_text or "law" in question_text.lower() or "code" in question_text.lower():
            return f"Under R.A. 7920 (New Electrical Engineering Law) and Board rules, {correct_choice_text} is enforced to regulate professional practice, safety standards, and administrative qualifications for PEE, REE, and RME practitioners."
        elif "9136" in question_text or "epira" in question_text.lower() or "power" in question_text.lower():
            return f"R.A. 9136 (EPIRA of 2001) restructured the Philippine electric power industry into Generation, Transmission, Distribution, and Supply, establishing competitive markets and regulatory standards under the ERC."
        else:
            return f"This requirement forms part of the regulatory guidelines under the Professional Regulatory Board of Electrical Engineering (PRBEE) and Philippine Electrical Code (PEC) standards for electrical engineering practice."

    # ECONOMICS
    elif subject == "Economics" or "cost" in question_text.lower() or "interest" in question_text.lower() or "annuity" in question_text.lower():
        if "annuity" in question_text.lower():
            return f"Annuity cash flows are key in engineering economy calculations. An ordinary annuity has payments at the end of each period, whereas annuity due has payments at the beginning of each period."
        elif "depreciation" in question_text.lower():
            return f"Depreciation reflects the accounting reduction in asset value over its useful service life due to wear, age, or obsolescence, affecting book value and tax liabilities."
        elif "interest" in question_text.lower() or "rate" in question_text.lower():
            return f"The nominal interest rate gives the periodic rate without compounding effects, while the effective interest rate accounts for compound intervals over the full annual period."
        else:
            return f"In engineering economics, {correct_choice_text} is a fundamental concept used in evaluating cash flows, asset feasibility, cost comparison, and capital investment decisions."

    # MECHANICS 1 / MECHANICS 2
    elif "mechanics" in subject.lower() or "force" in question_text.lower() or "motion" in question_text.lower() or "friction" in question_text.lower():
        if "friction" in question_text.lower() or "sled" in question_text.lower() or "inclined" in question_text.lower():
            return f"On an inclined slope of angle θ, the normal contact force perpendicular to the surface is N = mg cos θ, making kinetic friction force f = μN = μ mg cos θ."
        elif "acceleration" in question_text.lower() or "velocity" in question_text.lower() or "speed" in question_text.lower():
            return f"Kinematics and dynamics relate net applied forces to mass and acceleration according to Newton's Second Law (F = ma) and energy/momentum conservation laws."
        else:
            return f"Engineering mechanics uses vector equilibrium (∑F = 0, ∑M = 0 in statics) and Newton's equations of motion in dynamics to solve structural and mechanical interactions."

    # COMMUNICATION
    elif subject == "Communication" or "frequency" in question_text.lower() or "signal" in question_text.lower() or "wave" in question_text.lower():
        if "fiber" in question_text.lower() or "light" in question_text.lower():
            return f"Optical fiber communications rely on total internal reflection within the core glass/plastic medium, providing high bandwidth and immunity to electromagnetic interference (EMI)."
        elif "noise" in question_text.lower():
            return f"Noise represents unwanted random electrical disturbances that corrupt signals, measured relative to signal power by the Signal-to-Noise Ratio (SNR)."
        else:
            return f"In telecommunications, {correct_choice_text} plays a crucial role in signal modulation, spectrum allocation, transmission media performance, and channel capacity."

    # PROJECT MANAGEMENT
    elif subject == "Project Management" or "project" in question_text.lower() or "schedule" in question_text.lower():
        return f"Project management methodologies rely on structured frameworks (such as WBS, PERT/CPM, and Gantt charts) to control scope, time, cost, and quality throughout project execution."

    # GENERAL
    else:
        return f"{correct_choice_text} represents the correct technical principle applying fundamental engineering laws, standardized definitions, and physical relationships."

# Test transforming
fixed = 0
for q in questions:
    new_e = build_rich_explanation(q)
    if new_e != q.get("explanation"):
        fixed += 1
        q["explanation"] = new_e

print("Updated", fixed, "explanations")
