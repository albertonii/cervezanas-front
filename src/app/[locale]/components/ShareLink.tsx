import { useTranslations } from 'next-intl';
import React from 'react';
import Button from './common/Button';

interface Props {
  link: string;
}

export default function ShareLink({ link }: Props) {
  const t = useTranslations();

  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(link);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const shareToWhatsapp = () => {
    const shareText =
      '¡Hola! Te comparto este link para que puedas comprar en Cervezanas:';
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      shareText,
    )}%20${encodeURIComponent(link)}`;

    try {
      // Detectar si el dispositivo es móvil o escritorio
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      if (isMobile) {
        // Redirigir a la aplicación de WhatsApp en dispositivos móviles
        window.location.href = `whatsapp://send?text=${encodeURIComponent(
          shareText,
        )}%20${encodeURIComponent(link)}`;
      } else {
        // Redirigir a WhatsApp Web en escritorio
        window.open(whatsappUrl, '_blank');
      }
    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
    }
  };

  const shareToTelegram = () => {
    const shareText =
      '¡Hola! Te comparto este link para que puedas comprar en Cervezanas:';
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      link,
    )}&text=${encodeURIComponent(shareText)}`;

    try {
      // Detectar si el dispositivo es móvil o escritorio
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        );
      if (isMobile) {
        // Redirigir a la aplicación de Telegram en dispositivos móviles
        window.location.href = `tg://msg_url?url=${encodeURIComponent(
          link,
        )}&text=${encodeURIComponent(shareText)}`;
      } else {
        // Redirigir a Telegram Web en escritorio
        window.open(telegramUrl, '_blank');
      }
    } catch (error) {
      console.error('Error sharing to Telegram:', error);
    }
  };

  return (
    <section className="w-full rounded-xl bg-gray-100 p-4">
      <div className="my-1 flex justify-around">
        {/* <!--WHATSAPP ICON--> */}
        <figure
          className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-green-200 fill-[#25D366] shadow-xl hover:bg-[#25D366] hover:fill-white hover:shadow-green-500/50"
          id="whatsapp-share"
          onClick={shareToWhatsapp}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18.403 5.633A8.919 8.919 0 0 0 12.053 3c-4.948 0-8.976 4.027-8.978 8.977 0 1.582.413 3.126 1.198 4.488L3 21.116l4.759-1.249a8.981 8.981 0 0 0 4.29 1.093h.004c4.947 0 8.975-4.027 8.977-8.977a8.926 8.926 0 0 0-2.627-6.35m-6.35 13.812h-.003a7.446 7.446 0 0 1-3.798-1.041l-.272-.162-2.824.741.753-2.753-.177-.282a7.448 7.448 0 0 1-1.141-3.971c.002-4.114 3.349-7.461 7.465-7.461a7.413 7.413 0 0 1 5.275 2.188 7.42 7.42 0 0 1 2.183 5.279c-.002 4.114-3.349 7.462-7.461 7.462m4.093-5.589c-.225-.113-1.327-.655-1.533-.73-.205-.075-.354-.112-.504.112s-.58.729-.711.879-.262.168-.486.056-.947-.349-1.804-1.113c-.667-.595-1.117-1.329-1.248-1.554s-.014-.346.099-.458c.101-.1.224-.262.336-.393.112-.131.149-.224.224-.374s.038-.281-.019-.393c-.056-.113-.505-1.217-.692-1.666-.181-.435-.366-.377-.504-.383a9.65 9.65 0 0 0-.429-.008.826.826 0 0 0-.599.28c-.206.225-.785.767-.785 1.871s.804 2.171.916 2.321c.112.15 1.582 2.415 3.832 3.387.536.231.954.369 1.279.473.537.171 1.026.146 1.413.089.431-.064 1.327-.542 1.514-1.066.187-.524.187-.973.131-1.067-.056-.094-.207-.151-.43-.263"
            ></path>
          </svg>
        </figure>

        {/* <!--TELEGRAM ICON--> */}
        <figure className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-sky-200 fill-[#229ED9] shadow-xl hover:bg-[#229ED9] hover:fill-white hover:shadow-sky-500/50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            onClick={shareToTelegram}
          >
            <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"></path>
          </svg>
        </figure>
      </div>

      <div className="mt-2 flex items-center justify-between space-x-4 border-2 border-gray-200 py-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className="ml-2 fill-gray-500"
        >
          <path d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-.943-.944-2.199-1.465-3.535-1.465s-2.592.521-3.535 1.465L4.929 12a5.008 5.008 0 0 0 0 7.071 4.983 4.983 0 0 0 3.535 1.462A4.982 4.982 0 0 0 12 19.071l.707-.707-1.414-1.414-.707.707a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.122-2.121z"></path>
          <path d="m12 4.929-.707.707 1.414 1.414.707-.707a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.122 2.121c-1.133 1.133-3.109 1.133-4.242 0L10.586 12l-1.414 1.414.707.707c.943.944 2.199 1.465 3.535 1.465s2.592-.521 3.535-1.465L19.071 12a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0z"></path>
        </svg>

        <input
          id="copy-link"
          className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-beer-softBlonde focus:outline-none focus:ring-beer-softBlonde sm:text-sm"
          type="text"
          placeholder="link"
          value="https://boxicons.com/?query=link"
        />

        <Button
          accent
          small
          onClick={copyToClipboard}
          class="focus:bg-black-200"
        >
          {t('copy')}
        </Button>
      </div>
    </section>
  );
}
