import React from 'react';
import Navbar from '../components/Navbar';
import './PolicyPage.css';

const policies = {
  cancellation: {
    title: 'Cancellation & Refund Policy',
    intro: 'We understand family schedules can change. This policy explains how session changes, cancellations, and refunds are handled.',
    sections: [
      {
        heading: 'Rescheduling',
        body: 'Please contact us as early as possible if you need to move a session. When schedule space is available, we will help you choose a new time.',
      },
      {
        heading: 'Cancellations',
        body: 'Cancellations made with reasonable notice may be rescheduled. Last-minute cancellations may count as a used session, especially when the coach or field time has already been reserved.',
      },
      {
        heading: 'Weather',
        body: 'If weather or field conditions make training unsafe, the session will be rescheduled. Player safety comes first.',
      },
      {
        heading: 'Refunds',
        body: 'Refunds are reviewed case by case. If a session cannot be provided by the academy, we will offer a reschedule or refund option.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    intro: 'We only collect the information needed to manage training, communicate with parents, and keep bookings organized.',
    sections: [
      {
        heading: 'Information We Collect',
        body: 'We may collect parent name, email, phone number, player name, player age, booking details, and notes shared during the booking process.',
      },
      {
        heading: 'How We Use It',
        body: 'We use this information to confirm sessions, contact families about schedule changes, manage payments, and improve the academy experience.',
      },
      {
        heading: 'Payments',
        body: 'Payments are handled by Stripe. We do not store card numbers on this website.',
      },
      {
        heading: 'Sharing',
        body: 'We do not sell family information. Information may only be shared with services needed to operate the website, booking, email, or payment systems.',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    intro: 'By using this website or booking a session, you agree to follow these basic terms.',
    sections: [
      {
        heading: 'Training Sessions',
        body: 'Session availability, locations, and times may change based on field access, weather, and coach availability.',
      },
      {
        heading: 'Parent Responsibility',
        body: 'Parents or guardians are responsible for providing accurate contact and player information during booking.',
      },
      {
        heading: 'Player Conduct',
        body: 'Players are expected to show respect for coaches, teammates, facilities, and equipment.',
      },
      {
        heading: 'Website Use',
        body: 'Please do not misuse the website, attempt unauthorized access, or submit false booking information.',
      },
    ],
  },
  consent: {
    title: 'Parent Consent & Liability Notice',
    intro: 'Soccer training involves physical activity. This notice helps families understand the basic safety expectations before attending.',
    sections: [
      {
        heading: 'Parent Consent',
        body: 'By booking a session, the parent or guardian confirms that the player has permission to participate in soccer training.',
      },
      {
        heading: 'Health & Safety',
        body: 'Parents should tell the coach about any medical condition, injury, allergy, or limitation that may affect training.',
      },
      {
        heading: 'Training Risk',
        body: 'Soccer can involve running, contact with the ball, quick movement, and possible injury. We work to create a safe training environment, but risk cannot be fully removed.',
      },
      {
        heading: 'What To Bring',
        body: 'Players should bring water, soccer shoes or suitable athletic shoes, shin guards when needed, and weather-appropriate clothing.',
      },
    ],
  },
};

const PolicyPage = ({ type }) => {
  const policy = policies[type] ?? policies.terms;

  return (
    <>
      <Navbar />
      <main className="policy-page">
        <section className="policy-container">
          <p className="policy-eyebrow">Lions Flame Soccer Academy</p>
          <h1>{policy.title}</h1>
          <p className="policy-intro">{policy.intro}</p>

          <div className="policy-sections">
            {policy.sections.map((section) => (
              <article key={section.heading} className="policy-section">
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
              </article>
            ))}
          </div>

          <div className="policy-note">
            For questions, contact us at{' '}
            <a href="mailto:lionsflamesocceracademy@gmail.com">lionsflamesocceracademy@gmail.com</a>.
          </div>
        </section>
      </main>
    </>
  );
};

export default PolicyPage;
