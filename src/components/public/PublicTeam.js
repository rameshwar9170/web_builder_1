import React from 'react';
import { FiMail, FiPhone, FiLinkedin, FiTwitter } from 'react-icons/fi';

const PublicTeam = ({ card }) => {
  const team = card.team?.members || [];
  const theme = card.theme || {};

  if (team.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Team information coming soon.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
        <p className="text-xl text-gray-600">Experienced professionals dedicated to your care</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {team.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {member.photo && (
              <div className="h-64 overflow-hidden">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-1" style={{ color: theme.primaryColor }}>
                {member.name}
              </h3>
              {member.role && (
                <p className="text-lg font-medium mb-3" style={{ color: theme.secondaryColor }}>
                  {member.role}
                </p>
              )}
              {member.bio && (
                <p className="text-gray-600 mb-4">{member.bio}</p>
              )}
              {member.specialization && (
                <p className="text-sm text-gray-500 mb-4">
                  <strong>Specialization:</strong> {member.specialization}
                </p>
              )}
              {member.experience && (
                <p className="text-sm text-gray-500 mb-4">
                  <strong>Experience:</strong> {member.experience}
                </p>
              )}
              
              <div className="flex gap-3 mt-4">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 rounded-full hover:bg-gray-100"
                    title="Email"
                  >
                    <FiMail style={{ color: theme.primaryColor }} />
                  </a>
                )}
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="p-2 rounded-full hover:bg-gray-100"
                    title="Phone"
                  >
                    <FiPhone style={{ color: theme.primaryColor }} />
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-gray-100"
                    title="LinkedIn"
                  >
                    <FiLinkedin style={{ color: theme.primaryColor }} />
                  </a>
                )}
                {member.twitter && (
                  <a
                    href={member.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full hover:bg-gray-100"
                    title="Twitter"
                  >
                    <FiTwitter style={{ color: theme.primaryColor }} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicTeam;
