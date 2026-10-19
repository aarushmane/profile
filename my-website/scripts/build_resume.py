"""Build the one-page website resume. Requires reportlab and pymupdf for QA."""
from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib import colors

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'static/resume.pdf'
styles = {k: ParagraphStyle(k, fontName=f, fontSize=s, leading=l, spaceAfter=a) for k,f,s,l,a in [
    ('name','Helvetica-Bold',23,25,3), ('contact','Helvetica',8.6,11,1),
    ('section','Helvetica-Bold',10.5,13,2), ('heading','Helvetica-Bold',9.1,11,0),
    ('body','Helvetica',8.8,10.8,1.5), ('role','Helvetica-Oblique',8.6,10.5,1.5)]}
styles['name'].alignment = styles['contact'].alignment = 1
story=[]
def p(t, s='body'): return Paragraph(t, styles[s])
def section(t):
    story.extend([Spacer(1,6),p(t,'section'),HRFlowable(width='100%',thickness=.65,color=colors.HexColor('#aaaaaa')),Spacer(1,3)])
def row(left,right,s='heading'):
    t=Table([[p(left,s),p(right,'body')]],colWidths=[405,135])
    t.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),0)]))
    story.append(t)
def bullet(t):
    style=ParagraphStyle('bullet',parent=styles['body'],leftIndent=9,firstLineIndent=-9)
    story.append(Paragraph('-  '+t,style))
def job(title,place,role,date,bullets):
    row(title,place);row(role,date,'role')
    for b in bullets: bullet(b)
    story.append(Spacer(1,3))
story += [p('Aarush Mane','name'),p('Robbinsville, NJ | +1 (609) 610-4280 | am6927@princeton.edu','contact'),p('<link href="https://aarushmane.github.io/profile/">aarushmane.github.io/profile/</link> | <link href="https://www.linkedin.com/in/aarush-mane/">linkedin.com/in/aarush-mane</link> | <link href="https://github.com/aarushmane">github.com/aarushmane</link>','contact')]
section('EDUCATION')
row('Princeton University','Princeton, NJ')
row('Bachelor of Science in Engineering, Computer Science','Expected 05/2030','role')
bullet('Dual Enrollment: Single Variable Analysis (MAT215), Linear Algebra with Intro to Proofs (MAT217), 2025-2026.')
row('Robbinsville High School','Graduated 06/2026')
bullet('Weighted GPA: 4.682/5.0; Unweighted: 3.977/4.0; SAT: 1530. National Merit Scholarship Winner; AP Scholar with Distinction; NJ State Seal of Biliteracy (Spanish).')
section('SELECTED PROJECT')
job('<link href="https://devpost.com/software/nemo-i69rus">Nemo | Pollution Source Investigation</link>','HackHarvard 2026','Simulation Workflow, Validation &amp; Technical Pitching','10/16-10/18/2026',[
'<b>3rd Overall Best Project; 2nd, ASUS "Save the Earth" Sustainability Track.</b> Pitched Nemo to multiple judges and sponsors, including <b>Capital One</b> and startup representatives.',
'<b>Conceived the Grok-assisted physics workflow</b> and authored simulation instructions exploring <b>advection, diffusion, Runge-Kutta (RK4), and Kalman filtering</b> for waste transport and reuse on later samples.',
'<b>Developed export-validation tests</b> to detect missing or contradictory trial records and verify <b>SHA-256 hashes</b>; co-designed reproducible protocols separating physical experiments from simulations.'])
section('EXPERIENCE')
job('FIRST Robotics Competition Team 2590, Nemesis','Robbinsville, NJ','Software Development &amp; Strategy Lead','10/2023-06/2026',[
'Led technical strategy and statistical performance modeling across <b>65 members</b>; built Excel/Sheets analytics supporting a <b>5th-place finish among 600+ teams</b> at the World Championship.',
'Built <b>Java/OpenCV vision</b>, Oculus Quest localization, and AprilTag PnP pose estimation; presented control systems to judges for the <b>Innovation in Control Award</b>.',
'Developed Java trajectory wrappers and subsystem scheduling; built <b>Argus</b>, a Slack AI agent integrating MiniMax, Nanobot, Python API scrapers, and GitHub workflows for scouting analytics.',
'Mentored <b>10+ developers</b> in Java, autonomous control, Git branching, testing, and pull request review.'])
job('NJ Governor\'s School of Engineering &amp; Technology','Rutgers University, NJ','Research Scholar','07/2025',[
'Collaborated on a <b>5-person research team</b> modeling autonomous path tracking; presented research to <b>300+ faculty, corporate sponsors, and industry partners</b> at the GSET Final Symposium.'])
job('FIRST Tech Challenge Team 22348, REAPR','Robbinsville, NJ','Founder &amp; Software Mentor','10/2022-06/2026',[
'Secured <b>$16,000+ in sponsorships</b> for a <b>15-member</b> community robotics initiative; managed institutional partnerships and expanded regional outreach and participation by <b>30%</b>.',
'Taught TensorFlow object detection and Java autonomous routines; built AppSheet data pipelines for tactical decisions.'])
job('iStart Valley','Remote','Financial Projections &amp; Business Strategy Intern','01/2025-06/2025',[
'Built financial projections, unit economics, and TAM/SAM/SOM analysis for the <b>BioPack concept pitch</b> (modeled $500k valuation); earned <b>Global Semifinalist</b> placement in the startup pitch contest.',
'Earned the <b>Gold Presidential Volunteer Service Award</b> for 265 hours of technical writing, stakeholder engagement, and community outreach.'])
section('PUBLICATIONS')
row('IEEE MIT Undergraduate Research Technology Conference','Presented 10/2025')
story.append(p('<b>Co-Author:</b> PID Control Optimization and Trajectory Tracking for Autonomous Differential Drive Robots | <link href="https://ieeexplore.ieee.org/document/11533106">IEEE Xplore</link>'))
bullet('Co-developed a Python nonlinear PID controller with moving integral windows, velocity-dependent target yaws, and anti-windup limits; compared A*/Dijkstra paths and ROS GazeboSim LiDAR obstacle avoidance.')
bullet('Validated controller performance with <b>TurtleBot Vicon</b> tracking and matched-pairs t-tests (<b>p &lt; 0.01</b>).')
section('TECHNICAL SKILLS')
story.append(p('<b>Languages &amp; Data:</b> Java, Python, MATLAB, LaTeX, JSON, HTML/CSS, Excel, Google Sheets, hypothesis testing'))
story.append(p('<b>Tools &amp; Methods:</b> OpenCV, TensorFlow, ROS, GazeboSim, Git, GitHub Actions, Vicon, AppSheet, SHA-256, software validation'))
story.append(p('<b>Strategy:</b> Sponsorship proposals, technical presentations, TAM/SAM/SOM | <b>Spoken:</b> English, Spanish, Telugu'))
SimpleDocTemplate(str(OUT),pagesize=(612,792),rightMargin=36,leftMargin=36,topMargin=23,bottomMargin=23,title='Aarush Mane - Resume',author='Aarush Mane').build(story)
print(OUT)
