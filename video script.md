
### Event Management App - Detailed Tech Demo Script
**Duration: ~6 minutes**

---

## INTRO (0:00 - 0:30)
"Welcome to our Event Management App demo. We designed this platform to specifically target four critical operational hurdles: **Advertising effectively**, **Tracking attendance**, **Balancing supply and demand**, and **Operating in low-resource settings**.

Rather than just showing features, we are going to trace the data flow of a single event—from the Organiser's dashboard to a Participant's offline device—to show you exactly how we solve these problems."

---

## SCENE 1: THE ORGANISER (0:30 - 2:00)
**[Visual: Organiser Signup with OTP and Password Login]**

"We begin with the **Organiser**. To ensure security, we use a secure One-Time Password (OTP) system for signup verification, followed by traditional password-based login for ongoing access.

**[Visual: Organiser Dashboard $\to$ Create Event Form]**

Once logged in, the Organiser sets up the event. This form is the primary control mechanism for **Challenge 3: Balancing Supply and Demand**. By enforcing a strict 'Capacity' limit here, the system creates a hard cap on registrations. This ensures that NGOs can match their limited resources—like food or kits—to the exact number of allowed attendees, preventing dangerous overcrowding or shortages.

**[Visual: Organiser Generates & Copies Promoter Invite Token]**

To solve **Challenge 1: Advertising Events**, the Organiser delegates outreach. They generate a secure 'Invitation Token'. This cryptographic token allows the organiser to authorize specific community leaders as Promoters. The organiser copies this token to share it via WhatsApp or email, initiating the distribution network."

---

## SCENE 2: THE PROMOTER (2:00 - 3:30)
**[Visual: Promoter Sign In (Existing Account)]**

"We now switch to the **Promoter**, the bridge between the NGO and the community.

**[Visual: Promoter Dashboard $\to$ Paste Token $\to$ Accept Invite]**

The Promoter logs in and pastes the invitation token. By accepting it, they link their account to the event. This solves the **Advertising Challenge** by enabling 'attributed impact'—the system tracks exactly how many people this specific promoter recruits, allowing organisers to identify and reward their most effective community influencers.

**[Visual: Promoter Generates QR Code]**

Here is our solution to **Challenge 4: Low-Resource Settings**. The Promoter generates a QR code. Unlike standard QR codes which are just web links, this code contains the event data embedded within it, secured by an Ed25519 digital signature. This means the code works completely offline. The Promoter can print this or show it on their screen in a remote village with no signal, and the data remains verifiable and intact."

---

## SCENE 3: THE PARTICIPANT (3:30 - 5:00)
**[Visual: Mobile View $\to$ Open App $\to$ Enter Details $\to$ Phone OTP]**

"Now we see the **Participant** view on a mobile device.

To solve **Challenge 2: Attendance Tracking**, we removed the barrier of account creation. The participant simply enters their Name, Email, and Phone Number, verifying via OTP. The app identifies them by device profile rather than a password-protected account. This frictionless entry is critical for users with lower digital literacy.

**[Visual: Participant taps 'Scan QR' $\to$ Scans Promoter's Code]**

The participant taps 'Add Event with QR' and scans the Promoter's code.

**[Visual: Event appears as 'Pending' $\to$ Syncs to Server]**

This specific moment demonstrates our **Offline-First Architecture**. When scanned, the event saves locally to the device immediately, marked as 'Pending'. This ensures the user can register even if the internet is down. As soon as connectivity is restored, the app automatically syncs with the central server. This guarantees that data collected in remote areas eventually flows back to headquarters."

---

## SCENE 4: CLOSING THE LOOP (5:00 - 5:45)
**[Visual: Cut back to Promoter Dashboard $\to$ Refresh/Highlight updated count]**

"Finally, we cut back to the **Promoter's view** to close the loop.

We can see the 'Impact' count has increased by one. This confirms that the Participant's local registration has successfully synced to the cloud.

By connecting the **Organiser's capacity controls**, the **Promoter's offline tools**, and the **Participant's frictionless sync**, we have created a loop that effectively solves the challenges of connectivity, tracking, and resource management in complex environments.

Thank you for watching."