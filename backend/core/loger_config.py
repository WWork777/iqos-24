import logging


class LogerConfig:
    loger_level = logging.WARNING

    def setup_logging(self):
        log_format_str = "[%(asctime)s.%(msecs)03d] %(module)20s:%(lineno)-4d %(levelname)8s - %(message)s"
        date_format_str = "%Y-%m-%d %H:%M:%S"

        root_logger = logging.root
        root_logger.setLevel(self.loger_level)

        if root_logger.handlers:
            root_logger.handlers.clear()

        formatter = logging.Formatter(fmt=log_format_str, datefmt=date_format_str)
        console_handler = logging.StreamHandler()
        console_handler.setLevel(self.loger_level)
        console_handler.setFormatter(formatter)

        root_logger.addHandler(console_handler)

        uvicorn_logger_names = ["uvicorn", "uvicorn.access", "uvicorn.error", "uvicorn.asgi"]
        for name in uvicorn_logger_names:
            uvicorn_logger = logging.getLogger(name)
            uvicorn_logger.setLevel(self.loger_level)
            uvicorn_logger.handlers.clear()
            uvicorn_logger.addHandler(console_handler)
            uvicorn_logger.propagate = False