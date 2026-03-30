import { useMemo, useState } from 'react';

const DEFAULT_AVATAR_SRC = '/favicon.svg';

function normalizeAvatarValue(value) {
  if (!value) {
    return null;
  }

  if (typeof value === 'object') {
    return normalizeAvatarValue(
      value.url
      || value.src
      || value.secure_url
      || value.location
      || value.href,
    );
  }

  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (
    trimmed.startsWith('http://')
    || trimmed.startsWith('https://')
    || trimmed.startsWith('//')
    || trimmed.startsWith('data:')
    || trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  return trimmed.startsWith('/') ? trimmed : `/${trimmed.replace(/^\.?\//, '')}`;
}

function resolveAvatarSource(user) {
  const candidates = [
    user?.avatarUrl,
    user?.avatar,
    user?.profileImageUrl,
    user?.profileImage,
    user?.imageUrl,
    user?.image,
    user?.photoUrl,
    user?.photo,
    user?.pictureUrl,
    user?.picture,
    user?.logoUrl,
    user?.logo,
  ]
    .map(normalizeAvatarValue)
    .filter(Boolean);

  return candidates[0] || DEFAULT_AVATAR_SRC;
}

export default function UserAvatar({
  user,
  alt,
  className = '',
  imageClassName = '',
  fallbackClassName = '',
  letterClassName = '',
}) {
  const avatarSrc = useMemo(() => resolveAvatarSource(user), [user]);
  const [failedSources, setFailedSources] = useState(() => new Set());

  const fallbackLetter = user?.name?.trim()?.[0]?.toUpperCase() || 'U';
  const imageAlt = alt || `${user?.name || 'User'} avatar`;
  const showImage = Boolean(avatarSrc) && !failedSources.has(avatarSrc);

  return (
    <div
      className={`overflow-hidden rounded-full border border-white/12 bg-white/[0.05] shadow-[0_18px_34px_rgba(0,0,0,0.18)] ${className}`.trim()}
    >
      {showImage ? (
        <img
          src={avatarSrc}
          alt={imageAlt}
          className={`h-full w-full object-cover ${imageClassName}`.trim()}
          onError={() => {
            setFailedSources((current) => {
              const next = new Set(current);
              next.add(avatarSrc);
              return next;
            });
          }}
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center bg-[var(--gradient-accent)] text-white ${fallbackClassName}`.trim()}
        >
          <span className={letterClassName}>{fallbackLetter}</span>
        </div>
      )}
    </div>
  );
}
